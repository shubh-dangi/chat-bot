from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class DocumentBase(BaseModel):
    filename: str
    doc_type: str = Field(..., alias="type")
    size_str: str = Field(..., alias="size")
    status: str = "Processed"  # Processed, Processing, Pending, Error

    model_config = ConfigDict(populate_by_name=True)


class DocumentCreate(DocumentBase):
    file_path: Optional[str] = None


class DocumentResponse(BaseModel):
    id: str
    filename: str
    doc_type: str = Field(..., alias="type")
    size_str: str = Field(..., alias="size")
    uploaded_at: str = Field(..., alias="uploadedAt")
    status: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
