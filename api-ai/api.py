from fastapi import FastAPI, HTTPException
from transformers import pipeline
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import json

# --- LLM Integration (Groq, LangChain, llama3) ---
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableSequence
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
LLAMA_MODEL = "qwen/qwen3-32b"

# Use LangChain's Runnable and OutputParser for robust LLM calls
llm = ChatGroq(api_key=GROQ_API_KEY, model=LLAMA_MODEL)
json_parser = JsonOutputParser()

def run_llama3_chain(prompt_template: str, input_variables: dict):
    prompt = ChatPromptTemplate.from_template(prompt_template)
    chain = (
        prompt | llm | json_parser
    )
    return chain.invoke(input_variables)

# Initialize zero-shot-classification pipeline for malicious intent detection
malicious_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Helper function to determine if request is malicious
MALICIOUS_LABELS = ["malicious", "attack", "exploit", "harmful", "phishing", "spam"]
def is_malicious_request(text: str) -> bool:
    result = malicious_classifier(text, MALICIOUS_LABELS)
    # If any malicious label is top-1 or has high score, flag as malicious
    top_label = result['labels'][0]
    top_score = result['scores'][0]
    return top_label in MALICIOUS_LABELS and top_score > 0.7

app = FastAPI()

# ----------------------------
# Models
# ----------------------------

class FocusAssistantRequest(BaseModel):
    task_type: str = Field(..., description="Type of task: writing, coding, learning, etc.")
    description: Optional[str] = Field(None, description="Brief description of the task")

class FocusAssistantResponse(BaseModel):
    predicted_distractions: List[str]
    suggested_workflow: str
    motivation_tips: List[str]
    recommended_tools: List[str]

class LearningPathRequest(BaseModel):
    topic: str
    duration_days: int
    level: str = Field(..., description="e.g., beginner, intermediate, advanced")
    availability_per_day: List[int] = Field(..., description="Minutes available per day, length = duration_days")

class LearningResource(BaseModel):
    title: str
    url: str
    type: str  # course, video, exercise
    free: bool

class LearningPathResponse(BaseModel):
    resources: List[LearningResource]
    study_schedule: Dict[str, Any]

class TimetableSlot(BaseModel):
    day: str
    start_time: str  # HH:MM
    end_time: str    # HH:MM
    task_type: str
    description: Optional[str] = None

class TimetableRequest(BaseModel):
    time_slots: List[TimetableSlot]
    preferences: Optional[Dict[str, Any]] = None
    constraints: Optional[Dict[str, Any]] = None

class TimetableResponse(BaseModel):
    timetable: List[TimetableSlot]
    export_options: List[str]

# ----------------------------
# Endpoints
# ----------------------------

@app.post("/focus-assistant", response_model=FocusAssistantResponse)
def focus_assistant(req: FocusAssistantRequest):
    prompt_template = (
        "You are a productivity AI assistant. A user is about to focus on a task.\n"
        "Task type: {task_type}\nDescription: {description}\n"
        "1. Predict possible distractions or blockers for this task type.\n"
        "2. Suggest a personalized workflow or routine (e.g., X mins reading, Y mins execution).\n"
        "3. Offer motivation tips, tools, or techniques for better focus (as a list).\n"
        "Respond as a JSON object with keys: predicted_distractions (list), suggested_workflow (str), motivation_tips (list), recommended_tools (list)."
    )
    try:
        data = run_llama3_chain(prompt_template, {
            "task_type": req.task_type,
            "description": req.description or 'N/A'
        })
        return FocusAssistantResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")

@app.post("/learning-path", response_model=LearningPathResponse)
def learning_path(req: LearningPathRequest):
    prompt_template = (
        "You are an expert learning coach. A user wants to learn {topic} at {level} level in {duration_days} days. "
        "They have the following minutes available per day: {availability_per_day}.\n"
        "1. Recommend a structured learning path: a mix of free/paid courses, YouTube playlists, and practice exercises "
        "(as a list of resources: title, url, type, free).\n"
        "2. Auto-generate a study schedule for the user, mapping their daily available minutes to topics and resources.\n"
        "Respond as a JSON object with keys: resources (list of dict), study_schedule (dict: day->plan)."
    )
    try:
        data = run_llama3_chain(prompt_template, {
            "topic": req.topic,
            "level": req.level,
            "duration_days": req.duration_days,
            "availability_per_day": req.availability_per_day
        })
        resources = [LearningResource(**r) for r in data['resources']]
        return LearningPathResponse(resources=resources, study_schedule=data['study_schedule'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")

@app.post("/timetable", response_model=TimetableResponse)
def timetable(req: TimetableRequest):
    # Combine input fields for malicious check (customize as needed)
    input_text = json.dumps(req.dict())
    if is_malicious_request(input_text):
        raise HTTPException(status_code=400, detail="Malicious or unsafe request detected.")

    export_options = ["pdf", "text"]
    # Optionally, call LLM for enhanced reasoning/output here if needed
    # response = run_llama3_chain(...)
    return TimetableResponse(timetable=req.time_slots, export_options=export_options)


# Add a root endpoint for health check
@app.get("/")
def root():
    return {"message": "NeuraNote API is running."}
