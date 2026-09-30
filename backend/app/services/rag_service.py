from abc import ABC, abstractmethod
from typing import Dict, List, Optional


class RAGServiceInterface(ABC):
    """Abstract interface for Retrieval-Augmented Generation context retrieval."""

    @abstractmethod
    async def retrieve_context(self, query: str, top_k: int = 3) -> List[Dict[str, str]]:
        """Retrieve relevant institutional context passages for a given query."""
        pass


class MockRAGService(RAGServiceInterface):
    """Mock RAG implementation searching internal document knowledge bases."""

    KNOWLEDGE_BASE = [
        {
            "id": "kb-1",
            "title": "Academic Calendar 2026",
            "snippet": "End-term examinations commence on November 15, 2026. Hall tickets released November 8.",
        },
        {
            "id": "kb-2",
            "title": "Placement Eligibility Criteria",
            "snippet": "Students must have a cumulative GPA of 3.0 or higher with zero active backlogs to sit for campus interviews.",
        },
        {
            "id": "kb-3",
            "title": "Hostel Regulations",
            "snippet": "Quiet hours are observed from 10:00 PM to 06:00 AM. Visitors permitted only in common lounges.",
        },
    ]

    async def retrieve_context(self, query: str, top_k: int = 3) -> List[Dict[str, str]]:
        q = query.lower()
        matched = [doc for doc in self.KNOWLEDGE_BASE if any(word in doc["title"].lower() or word in doc["snippet"].lower() for word in q.split())]
        if not matched:
            matched = self.KNOWLEDGE_BASE
        return matched[:top_k]


rag_service: RAGServiceInterface = MockRAGService()
