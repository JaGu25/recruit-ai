from pydantic import BaseModel


class UploadResumesResponse(BaseModel):
  message: str
