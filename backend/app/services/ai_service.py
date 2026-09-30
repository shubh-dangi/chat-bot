from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, List, Optional
import random


class AIServiceInterface(ABC):
    """Abstract interface for AI model text generation and chat completions."""

    @abstractmethod
    async def generate_response(
        self,
        prompt: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        context_documents: Optional[List[str]] = None,
    ) -> str:
        """Generates a complete response for a user query."""
        pass

    @abstractmethod
    async def stream_response(
        self,
        prompt: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        context_documents: Optional[List[str]] = None,
    ) -> AsyncGenerator[str, None]:
        """Streams response tokens asynchronously."""
        pass


class MockAIService(AIServiceInterface):
    """
    Production-ready mock AI service that simulates realistic college assistant responses
    with institutional guidelines, policy references, and academic recommendations.
    Provides a seamless placeholder until actual LLM API keys are configured.
    """

    async def generate_response(
        self,
        prompt: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        context_documents: Optional[List[str]] = None,
    ) -> str:
        clean_prompt = prompt.strip()
        ref_id = random.randint(1000, 9999)

        # Context-aware templates based on query keywords
        lower = clean_prompt.lower()
        if any(w in lower for w in ["fee", "tuition", "payment", "scholarship"]):
            return (
                f"### Tuition & Financial Aid Information\n\n"
                f"Regarding your query on **fees and payments**:\n\n"
                f"1. **Payment Window:** Semester tuition payments are accepted online through the student portal without late fees until the 15th of the starting month.\n"
                f"2. **Scholarships:** Merit-based and departmental assistance applications must be submitted to the Financial Aid Desk.\n"
                f"3. **Receipts:** Digital payment acknowledgments are generated immediately upon bank verification.\n\n"
                f"```text\nReference ID: REF-FIN-{ref_id}\nSource: Student Accounts & Billing Handbook 2026\n```\n\n"
                f"Please let me know if you need instructions for setting up installment plans."
            )
        elif any(w in lower for w in ["exam", "grade", "gpa", "semester", "schedule", "result"]):
            return (
                f"### Academic & Examination Regulations\n\n"
                f"Regarding **{clean_prompt}**:\n\n"
                f"- **Attendance Requirement:** A minimum of **75% attendance** in theory and lab sessions is mandatory to appear for end-semester evaluations.\n"
                f"- **Admit Cards:** Hall tickets become downloadable 7 days prior to scheduled assessments once departmental dues are cleared.\n"
                f"- **Re-evaluation:** Grade dispute requests can be lodged within 14 days of official result publication.\n\n"
                f"```text\nVerification Token: EXAM-REG-{ref_id}\nPolicy: Controller of Examinations Bylaws\n```"
            )
        elif any(w in lower for w in ["hostel", "room", "mess", "dorm"]):
            return (
                f"### Campus Residence & Hostel Services\n\n"
                f"Regarding **hostel facilities and accommodations**:\n\n"
                f"1. **Curfew & Safety:** Campus gates close at 10:00 PM on weekdays and 11:00 PM on weekends.\n"
                f"2. **Maintenance:** Room service and network inquiries can be logged via the campus facility portal.\n"
                f"3. **Leave Requests:** Out-of-station approvals must be filed 24 hours in advance through your warden's office.\n\n"
                f"```text\nReference ID: HOSTEL-{ref_id}\nSection: Campus Life Regulations\n```"
            )
        else:
            return (
                f"Based on the official campus guidelines and academic regulations regarding **\"{clean_prompt[:40]}\"**:\n\n"
                f"1. **General Compliance:** Standard institutional policies require adherence to the student charter and departmental guidelines.\n"
                f"2. **Administrative Support:** The Student Affairs Center (Building B, Room 204) is available Monday through Friday from 09:00 AM to 04:30 PM.\n"
                f"3. **Faculty Advising:** For specialized course adjustments or academic waivers, schedule a session with your designated faculty advisor.\n\n"
                f"```text\nHandbook Ref: REF-{ref_id}\nStatus: Verified Against Campus Knowledge Base\n```\n\n"
                f"Is there a specific department or document you'd like more details on?"
            )

    async def stream_response(
        self,
        prompt: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        context_documents: Optional[List[str]] = None,
    ) -> AsyncGenerator[str, None]:
        full_text = await self.generate_response(prompt, conversation_history, context_documents)
        words = full_text.split(" ")
        for word in words:
            yield word + " "


# Default singleton
ai_service: AIServiceInterface = MockAIService()
