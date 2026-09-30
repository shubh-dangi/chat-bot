from datetime import datetime
from typing import Any, Dict, List, Optional, Union
import uuid
from pydantic import BaseModel, ConfigDict, Field


class DocumentBase(BaseModel):
    filename: Optional[str] = Field(default=None, alias="filename")
    file_name: Optional[str] = Field(default=None, alias="file_name")
    title: Optional[str] = None
    description: Optional[str] = None
    doc_type: Optional[str] = Field(default="Official Circular", alias="type")
    size_str: Optional[str] = Field(default="1.0 MB", alias="size")
    storage_path: Optional[str] = None
    mime_type: Optional[str] = "application/pdf"
    file_size: Optional[int] = 1048576
    status: Optional[str] = "Processed"

    model_config = ConfigDict(populate_by_name=True)


class DocumentCreate(DocumentBase):
    filename: str = Field(..., alias="filename")


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None


class DocumentResponse(BaseModel):
    id: Union[uuid.UUID, str]
    filename: str = Field(..., alias="filename")
    doc_type: str = Field(..., alias="type")
    size_str: str = Field(..., alias="size")
    uploaded_at: str = Field(..., alias="uploadedAt")
    status: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class DocumentChunkBase(BaseModel):
    chunk_index: int = Field(..., ge=0)
    content: str = Field(..., min_length=1)
    chunk_metadata: Dict[str, Any] = Field(default_factory=dict)


class DocumentChunkCreate(DocumentChunkBase):
    pass


class DocumentChunkResponse(DocumentChunkBase):
    id: uuid.UUID
    document_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
