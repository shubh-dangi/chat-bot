from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class RAGServiceInterface(ABC):
    """Abstract interface for Retrieval-Augmented Generation context retrieval with permission filtering."""

    @abstractmethod
    async def retrieve_context(
        self,
        query: str,
        user_role: str = "student",
        user_id: Optional[str] = None,
        top_k: int = 3,
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant institutional context passages for a given query, filtered by user authorization."""
        pass


class MockRAGService(RAGServiceInterface):
    """
    RAG implementation searching institutional documents with strict permission filtering.
    Restricts confidential faculty and administrative documentation from leaking to students.
    """

    KNOWLEDGE_BASE = [
        {
            "id": "kb-1",
            "title": "Academic Calendar 2026",
            "snippet": "End-term examinations commence on November 15, 2026. Hall tickets released November 8.",
            "min_role": "student",  # accessible to all
        },
        {
            "id": "kb-2",
            "title": "Placement Eligibility Criteria",
            "snippet": "Students must have a cumulative GPA of 3.0 or higher with zero active backlogs to sit for campus interviews.",
            "min_role": "student",  # accessible to all
        },
        {
            "id": "kb-3",
            "title": "Hostel Regulations",
            "snippet": "Quiet hours are observed from 10:00 PM to 06:00 AM. Visitors permitted only in common lounges.",
            "min_role": "student",  # accessible to all
        },
        {
            "id": "kb-4",
            "title": "Faculty Compensation and Discretionary Grading Bylaws",
            "snippet": "Confidential faculty grading curves and moderation rubrics for semester examinations.",
            "min_role": "teacher",  # restricted to faculty and admin
        },
        {
            "id": "kb-5",
            "title": "Administrative Infrastructure Budget and Master Key Roster",
            "snippet": "Restricted administrative physical keycodes and IT server room biometric schedules.",
            "min_role": "admin",  # restricted strictly to admin
        },
    ]

    ROLE_HIERARCHY = {
        "student": 1,
        "teacher": 2,
        "faculty": 2,
        "admin": 3,
    }

    async def retrieve_context(
        self,
        query: str,
        user_role: str = "student",
        user_id: Optional[str] = None,
        top_k: int = 3,
    ) -> List[Dict[str, Any]]:
        user_rank = self.ROLE_HIERARCHY.get(user_role.lower(), 1)
        q = query.lower()

        # Step 1: Semantic keyword matching
        matched = [
            doc for doc in self.KNOWLEDGE_BASE
            if any(word in doc["title"].lower() or word in doc["snippet"].lower() for word in q.split())
        ]
        if not matched:
            matched = self.KNOWLEDGE_BASE

        # Step 2: Mandatory Permission Filtering (RAG Authorization)
        authorized = [
            doc for doc in matched
            if user_rank >= self.ROLE_HIERARCHY.get(doc.get("min_role", "student"), 1)
        ]

        return authorized[:top_k]


rag_service: RAGServiceInterface = MockRAGService()
