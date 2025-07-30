import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Literal, Dict, Any
import json
import re 
from fastapi.middleware.cors import CORSMiddleware 

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from langchain_community.tools import DuckDuckGoSearchResults

# Initialize FastAPI app
app = FastAPI(
    title="LangChain Groq Agent App",
    description="This FastAPI application leverages LangChain-Groq agents to provide comprehensive solutions. It identifies potential blockers and suggests effective solutions for various tasks. Furthermore, it generates structured study plans for any given topic, including learning approaches, actionable tips, and curated materials with verified links and explanations, all powered by DuckDuckGo Search for accurate and up-to-date information.",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

llm = ChatGroq(temperature=0, groq_api_key=GROQ_API_KEY, model_name="llama3-70b-8192")

# --- Pydantic Models for Request and Response ---

class BlockerRequest(BaseModel):
    """Request model for identifying task blockers and solutions."""
    task: str = Field(..., description="The task the user is focusing on.")
    focus_time: str = Field(..., description="The duration the user will be focusing for (e.g., '2 hours', 'until tomorrow evening').")

class BlockerSolution(BaseModel):
    """Model for a single potential blocker and its solution."""
    blocker: str = Field(..., description="A potential obstacle or challenge for the task.")
    solution: str = Field(..., description="A proposed solution or mitigation for the blocker.")

class BlockerResponse(BaseModel):
    """Response model for potential blockers and solutions."""
    potential_blockers: List[BlockerSolution] = Field(..., description="A list of potential blockers and their corresponding solutions.")

class Material(BaseModel):
    """Model for a single learning material."""
    type: Literal["book", "video", "article", "course", "other"] = Field(..., description="Type of the material.")
    title: str = Field(..., description="Title of the material.")
    author: Optional[str] = Field(None, description="Author or creator of the material.")

class ReferenceLink(BaseModel):
    """Model for a single reference link with AI-generated explanation."""
    link: HttpUrl = Field(..., description="The URL of the reference link.")
    # Added a default value to ensure this field is never missing
    ai_link_explanation: str = Field( ..., description="An AI-generated explanation of what the link provides.")

# Moved LinkExplanation class definition here to resolve NameError
class LinkExplanation(BaseModel):
    explanation: str = Field(..., description="A brief explanation of what the link provides and why it's relevant.")

class StudyTopicResponse(BaseModel):
    """Response model for a study topic."""
    id: str = Field(..., description="Unique identifier for the topic.")
    topic_title: str = Field(..., description="Title of the study topic.")
    topic_tips: str = Field(..., description="Tips about what to work on and books/materials to refer for the topic.")
    advice: str = Field(..., alias="Advice", description="Detailed advice on how to go about learning the requested course.") # New field
    materials: List[Material] = Field(..., description="A list of recommended learning materials.")
    reference_links: List[ReferenceLink] = Field(..., description="A list of relevant reference URLs with explanations.")
    order_index: int = Field(..., description="An index indicating the order if part of a larger curriculum.")

# Updated Pydantic model
class InitialStudyPlanContent(BaseModel):
    """Intermediate model"""
    topic_title: str = Field(..., description="Title of the study topic.")
    topic_tips: str = Field(..., description="Tips about what to work on and books/materials to refer for the topic.")
    learning_approach: str = Field(..., description="A brief explanation on how to learn the sport/topic.")
    advice: str = Field(..., description="Detailed advice on how to go about learning the requested course.") # New field
    materials: List[Material] = Field(..., description="A list of recommended learning materials with unique, AI-generated titles and authors.")

#New Pydantic model
class PromptRequest(BaseModel):
    prompt: str = Field(..., description="The user's input prompt.")

# New Pydantic model for generic text response to frontend
class TextResponse(BaseModel):
    response: str = Field(..., description="The AI's response as a plain string.")


# --- LangChain Prompts ---

# Prompt for Blocker/Solution generation
blocker_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an AI assistant specialized in identifying potential blockers and providing practical solutions for tasks. Your goal is to help users anticipate challenges and plan effectively. Respond only with a JSON object."),
    ("human", "I am focusing on the task: '{task}' for '{focus_time}'. Please identify potential blockers and suggest concrete solutions. Provide the output as a JSON object with a single key 'potential_blockers' which is a list of objects, each having 'blocker' and 'solution' keys.")
])

# Updated prompt for initial study plan generation (now includes materials and advice)
initial_study_plan_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an AI assistant specialized in creating structured study plans for any given topic. Your output must be a JSON object following the exact schema provided.
    Generate unique and relevant titles, types, and authors for learning materials.
    Do NOT include any links or 'Why is this recommended' field in the 'materials' section.
    Ensure 'topic_tips' contains detailed, actionable advice for practice.
    Ensure 'advice' contains a detailed paragraph on how to go about learning the requested course.
    """),
    ("human", """Generate a comprehensive study plan for the topic: '{topic}'.
    Include a section on how to learn the topic/sport, provide detailed tips on what to work on and what practice routines they can follow, and offer general advice.
    The output should be a JSON object with the following structure:
    {{
        "topic_title": "<Title of the study topic>",
        "topic_tips": "<Detailed tips about what to work on and practice routines, including books/materials to refer (by title/author only, no links)>",
        "learning_approach": "<Brief explanation on how to learn the sport/topic>",
        "advice": "<Detailed paragraph on how to go about learning the requested course>",
        "materials": [
            {{"type": "book/video", "title": "<Unique AI-generated Title>", "author": "<AI-generated Author, optional>"}},
            {{"type": "video", "title": "<Unique AI-generated Title>", "author": "<AI-generated Author, optional>"}},
            {{"type": "course", "title": "<Unique AI-generated Title>", "author": "<AI-generated Author, optional>"}}
        ]
    }}
    Ensure 'materials' includes at least 5 diverse resources (e.g., 2 books, 2 videos, 1 course), all with unique, AI-generated titles and authors.
    """)
])

# Prompt for link explanation (for reference links) - remains the same
link_explanation_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an AI assistant that provides concise explanations for web resources. Given a resource title, URL, and a brief snippet, provide a 1-2 sentence explanation of what the link provides and why it's relevant for learning a topic. Respond only with a JSON object with a single key 'explanation'."),
    ("human", "Resource Title: '{title}'\nURL: '{url}'\nSnippet: '{snippet}'\n\nProvide a brief explanation for this link.")
])


# --- LangChain Chains ---

# Chain for Blocker/Solution
blocker_chain = blocker_prompt | llm.with_structured_output(schema=BlockerResponse)

# New chain for initial study plan generation (now generates full plan including materials)
initial_study_plan_chain = initial_study_plan_prompt | llm.with_structured_output(schema=InitialStudyPlanContent)

# Chain for link explanation (now used for reference links)
link_explanation_chain = link_explanation_prompt | llm.with_structured_output(schema=LinkExplanation)


# --- FastAPI Endpoints ---

@app.post("/identify-blockers", response_model=BlockerResponse)
async def identify_blockers(request: BlockerRequest):
    """
    Identifies potential blockers and suggests solutions for a given task and focus time.
    """
    try:
        response = await blocker_chain.ainvoke({"task": request.task, "focus_time": request.focus_time})
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing blocker request: {str(e)}")

@app.post("/study-topic", response_model=StudyTopicResponse)
async def study_topic(topic_name: str):
    """
    Generates a structured study plan for a given topic, including materials and reference links,
    using verified information from DuckDuckGo Search.
    """
    try:
        # Step 1: LLM generates initial study plan core structure (title, tips, learning approach, advice, and materials)
        initial_plan_response = await initial_study_plan_chain.ainvoke({"topic": topic_name})

        # Initialize DuckDuckGo Search tool to return JSON
        ddg_search_tool = DuckDuckGoSearchResults(output_format="json")

        final_reference_links: List[ReferenceLink] = []
        seen_reference_links = set() # To track unique URLs for reference_links

        general_ref_queries = [
            
            f"{topic_name} resources list",
            f"introduction to {topic_name} learning guide",
            f"best {topic_name} tutorials for beginners",
            f"best resources to learn {topic_name}"
        ]
        
        for query in general_ref_queries:
            raw_ref_output = None
            try:
                raw_ref_output = ddg_search_tool.invoke(query)
            except Exception as e:
                print(f"Error during DuckDuckGo search for '{query}': {e}")
                continue # Skip to the next query if search fails
            
            try:
                parsed_refs = json.loads(raw_ref_output)
                if isinstance(parsed_refs, list):
                    for ref_res in parsed_refs[:3]: # Get top 3 general refs per query to increase chances
                        link = ref_res.get("link")
                        snippet = ref_res.get("snippet", "")
                        if link and link not in seen_reference_links:
                            try:
                                # Generate explanation for general reference links
                                explanation_response = await link_explanation_chain.ainvoke({
                                    "title": ref_res.get("title", f"General Reference for {topic_name}"),
                                    "url": link,
                                    "snippet": snippet
                                })
                                # Ensure explanation is a string and not empty
                                explanation_text = explanation_response.explanation if explanation_response.explanation else "Explanation for this resource is currently unavailable."

                                final_reference_links.append(ReferenceLink(
                                    link=HttpUrl(link),
                                    ai_link_explanation=explanation_text # Use the explanation from LLM or fallback
                                ))
                                seen_reference_links.add(link)
                            except ValueError:
                                print(f"Invalid URL found: {link}")
                                pass # Skip invalid URLs
                            except Exception as llm_exp_error: # Catch errors from LLM explanation generation
                                print(f"Error generating explanation for reference link {link}: {llm_exp_error}")
                                final_reference_links.append(ReferenceLink(
                                    link=HttpUrl(link),
                                    ai_link_explanation="Explanation for this resource is currently unavailable."
                                ))
                                seen_reference_links.add(link)
            except (json.JSONDecodeError, ValueError) as e:
                print(f"Error parsing DuckDuckGo results for '{query}': {e}")
                # Fallback for DDG parsing failure: try to extract a single URL if present from raw_ref_output
                url_match = re.search(r'https?://[^\s]+', raw_ref_output or '') # Use raw_ref_output if not None
                if url_match:
                    link = url_match.group(0)
                    if link not in seen_reference_links:
                        try:
                            final_reference_links.append(ReferenceLink(
                                link=HttpUrl(link),
                                ai_link_explanation=f"A general reference link found via search for {topic_name}."
                            ))
                            seen_reference_links.add(link)
                        except ValueError:
                            print(f"Invalid URL in fallback: {link}")
                            pass # Skip invalid URLs

        # Ensure reference_links is never empty
        if not final_reference_links:
            # Add a generic fallback Wikipedia link or similar if no links were found
            fallback_link = f"https://en.wikipedia.org/wiki/{topic_name.replace(' ', '_')}"
            final_reference_links.append(ReferenceLink(
                link=HttpUrl(fallback_link),
                ai_link_explanation=f"A general informational resource about {topic_name}."
            ))
            print(f"Fallback reference link added for {topic_name}.")


        # Generate a simple ID based on the topic name
        topic_id = f"topic-{topic_name.lower().replace(' ', '-')}-1"

        # Step 3: Construct the final StudyTopicResponse
        response = StudyTopicResponse(
            id=topic_id,
            topic_title=initial_plan_response.topic_title,
            topic_tips=initial_plan_response.topic_tips,
            Advice=initial_plan_response.advice, # Correctly map the advice field using its alias
            materials=initial_plan_response.materials,
            reference_links=final_reference_links,
            order_index=1
        )
        
        return response
    except Exception as e:
        print(f"Unhandled exception in study_topic: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing study topic request: {str(e)}")

@app.post("/api/generate", response_model=TextResponse)
async def generate_response(request: PromptRequest):
    """
    Receives a prompt from the frontend and routes it to the appropriate LangChain agent,
    then formats the response as a simple string.
    """
    user_prompt = request.prompt.lower()
    
    try:
        if "blockers" in user_prompt or ("task" in user_prompt and "focus" in user_prompt):
            # Attempt to extract task and focus_time from the prompt
            # This is a simple heuristic; for a robust solution, consider a more structured input
            task_match = re.search(r"task:\s*(.*?)(?:\s*for|$)", user_prompt)
            focus_time_match = re.search(r"for\s*(.*)", user_prompt)

            task = task_match.group(1).strip() if task_match else "my current task"
            focus_time = focus_time_match.group(1).strip() if focus_time_match else "an unspecified duration"

            blocker_request = BlockerRequest(task=task, focus_time=focus_time)
            blocker_response = await identify_blockers(blocker_request)
            
            formatted_response = "Potential Blockers and Solutions:\n"
            if blocker_response.potential_blockers:
                for i, bs in enumerate(blocker_response.potential_blockers):
                    formatted_response += f"{i+1}. **Blocker:** {bs.blocker}\n   **Solution:** {bs.solution}\n"
            else:
                formatted_response += "No specific blockers identified at this time."
            
            return TextResponse(response=formatted_response)

        else:
            #Basic Case
        
            topic_name = request.prompt.strip()
            study_plan_response = await study_topic(topic_name)
            
            formatted_response = f"**Study Plan for: {study_plan_response.topic_title}**\n\n"
            formatted_response += f"**Learning Approach:** {study_plan_response.learning_approach}\n\n"
            formatted_response += f"**Tips:** {study_plan_response.topic_tips}\n\n"
            formatted_response += f"**General Advice:** {study_plan_response.advice}\n\n" # Display new advice field
            
            if study_plan_response.materials:
                formatted_response += "**Learning Materials:**\n"
                for material in study_plan_response.materials:
                    formatted_response += f"- **{material.title}** ({material.type}, {material.author or 'N/A'})\n"
                formatted_response += "\n"

            if study_plan_response.reference_links:
                formatted_response += "**Reference Links:**\n"
                for ref_link_obj in study_plan_response.reference_links:
                    formatted_response += f"- {ref_link_obj.link}\n  Explanation: {ref_link_obj.ai_link_explanation}\n"
            else: # empty fallback
                formatted_response += "**Reference Links:** No specific online resources found at this time. Please try searching directly for '{topic_name}' on your preferred search engine.\n"
            
            return TextResponse(response=formatted_response)

    except HTTPException as e:
        print(f"HTTPException in generate_response: {e.detail}")
        return TextResponse(response=f"Error: {e.detail}")
    except Exception as e:
        print(f"Unhandled exception in generate_response: {e}")
        return TextResponse(response=f"An unexpected error occurred: {str(e)}. Please try rephrasing your request.")
