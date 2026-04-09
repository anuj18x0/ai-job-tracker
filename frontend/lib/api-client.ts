import type { ApplicationFormData, JobApplication } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Authentication and User-related API calls (Client-side)
 */

export async function login(email: string, password: string) {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}

export async function register(name: string, email: string, password: string) {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
    });
    return res.json();
}

export async function verifyEmail(token: string) {
    const res = await fetch(`${BACKEND_URL}/api/auth/verify-email/${token}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    return res.json();
}

export async function getMe() {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    return res.json();
}

export async function getJobApplications() {
    const res = await fetch(`${BACKEND_URL}/api/jobs`, {
        method: "GET",
        credentials: "include",
    });
    return res.json();
}

export async function createApplication(data: ApplicationFormData) {
    const res = await fetch(`${BACKEND_URL}/api/jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateApplication(id: string, data: Partial<JobApplication>) {
    const res = await fetch(`${BACKEND_URL}/api/jobs/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteApplication(id: string) {
    const res = await fetch(`${BACKEND_URL}/api/jobs/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    return res.json();
}

export async function generateAISuggestions(id: string) {
    const res = await fetch(`${BACKEND_URL}/api/jobs/${id}/suggest`, {
        method: "POST",
        credentials: "include",
    });
    return res.json();
}

export async function generateAISuggestionsStream(id: string, onChunk: (chunk: string) => void) {
  const response = await fetch(`${BACKEND_URL}/api/jobs/${id}/suggest-stream`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.trim().startsWith("data: ")) {
        const data = line.trim().slice(6);
        if (data === "[DONE]") return;
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.chunk) {
            onChunk(parsed.chunk);
          }
        } catch (e) {
          // Ignore partial JSON lines if they happen
        }
      }
    }
  }
}

export async function parseJD(jd: string) {
    const res = await fetch(`${BACKEND_URL}/api/jobs/parse`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ jd }),
    });
    return res.json();
}

export async function uploadResume(file: File) {
    const formData = new FormData();
    formData.append('resume', file);
    
    const res = await fetch(`${BACKEND_URL}/api/resume/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    return res.json();
}

export async function getResumeStatus() {
    const res = await fetch(`${BACKEND_URL}/api/resume/status`, {
        method: "GET",
        credentials: "include",
    });
    return res.json();
}

export async function logout() {
    const res = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
    });
    return res.json();
}


