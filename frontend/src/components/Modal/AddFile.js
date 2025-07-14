import React, { useState } from 'react'
import { useUser } from "@clerk/clerk-react";
import UploadIcon from '@mui/icons-material/CloudUpload';

export default function AddFile() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const addFile = async () => {
    if (!title || !content || !user?.id) {
      alert("Please enter all fields.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("user_id", user.id);
    formData.append("isPublic", isPublic ? "1" : "0");

    if (file) {
      formData.append("file", file);
    }



    try {
      const res = await fetch("https://programming-prep.onrender.com/api/notes/add", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to add note");
      }

      const data = await res.json();
      if (data && data.note) {
        alert(data.message);

        // Reset the form
        setTitle("");
        setContent("");
        setFile(null);
        setIsPublic(true);
        setFileInputKey(Date.now());
        // Reload the page after adding the note
        window.location.reload();

        // Hide modal
        const modalElement = document.getElementById("addFile");
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
          setTimeout(() => {
            document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "";
          }, 300);
        }
        document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
      }
      else {
        alert("Note added but received unexpected response format");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <div className="modal fade" id="addFile" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header purple-500-bg text-white">
              <h4 className="modal-title w-100 text-center fw-bold" id="staticBackdropLabel"><UploadIcon fontSize="large" /> Upload Files</h4>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              <div className="card p-4 border-0 shadow-sm">
                <form>
                  <div class="input-group mb-3">
                    <input type="file" key={fileInputKey} className="form-control shadow-sm rounded-3" id="file" onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="accessspecifer"
                      id="public"
                      value="1"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                    />
                    <label className="form-check-label" htmlFor="public">Public</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="accessspecifer"
                      id="private"
                      value="0"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                    />
                    <label className="form-check-label" htmlFor="private">Private</label>
                  </div>

                  <div className="mb-3">
                    <input type="text" className="form-control p-3 shadow-sm rounded-3" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <textarea className="form-control p-3 shadow-sm rounded-3" id="description" rows="3" placeholder="Description" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                  </div>
                </form>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary px-4" onClick={addFile} disabled={loading}><UploadIcon />{loading ? " Adding..." : " Upload"}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

