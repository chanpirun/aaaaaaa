import type { Project } from "@/data/projects";

export type ProjectType = {
  id: number;
  name: string;
  is_default: boolean;
};

type SubmissionApiRecord = {
  id: number;
  title: string;
  tags: string[];
  project_type_id: number | null;
  project_type: ProjectType | null;
  owner_type: "individual" | "team";
  owner_name: string;
  team_members: string[] | null;
  team_member_ids: number[] | null;
  user_id: number;
  user?: { id: number; name: string; email: string };
  description: string;
  cover_image_path: string;
  document_path: string | null;
  document_paths: string[] | null;
  source_code_path: string | null;
  source_code_paths: string[] | null;
  dataset_path: string | null;
  dataset_paths: string[] | null;
  project_image_paths: string[] | null;
  demo_link: string | null;
  status: "pending" | "approved" | "rejected";
  review_comment: string | null;
  reviewed_by_role: "assistant" | "director" | null;
  reviewed_at: string | null;
  visibility: "public" | "private";
  created_at: string;
};

export type GroupHubProject = Project & {
  projectType: ProjectType | null;
  teamMemberIds: number[];
  teamMembers: string[];
  submittedByUserId: number;
  submitterName: string;
};

export type GroupContribution = {
  id: number;
  project_submission_id: number;
  project_submission?: { id: number; title: string; status: string };
  user_id: number;
  user_name: string;
  category: "manuscript" | "frontend" | "backend" | "database" | "postman";
  file_path: string;
  file_name: string;
  created_at: string;
};

export type TeamDocument = {
  id: number;
  user_id: number;
  submitter_name: string;
  title: string;
  description: string | null;
  tagged_member_ids: number[] | null;
  tagged_member_names: string[] | null;
  manual_doc_path: string | null;
  manual_doc_name: string | null;
  source_code_path: string | null;
  source_code_name: string | null;
  database_path: string | null;
  database_name: string | null;
  final_doc_path: string | null;
  final_doc_name: string | null;
  created_at: string;
};

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("auth") ?? sessionStorage.getItem("auth");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

export function toAbsoluteFileUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";
  return `${backendBaseUrl}/storage/${path}`;
}

function toAbsoluteFileUrls(
  paths: (string | null | undefined)[] | null | undefined,
): string[] {
  return (paths ?? [])
    .map((path) => toAbsoluteFileUrl(path))
    .filter((path): path is string => Boolean(path));
}

export function mapSubmissionToProject(item: SubmissionApiRecord): Project {
  const pdfs = toAbsoluteFileUrls(item.document_paths);
  const sourceZips = toAbsoluteFileUrls(item.source_code_paths);
  const datasets = toAbsoluteFileUrls(item.dataset_paths);
  const finalDocuments = toAbsoluteFileUrls(item.project_image_paths);
  const fallbackPdf = toAbsoluteFileUrl(item.document_path);
  const fallbackSourceZip = toAbsoluteFileUrl(item.source_code_path);
  const fallbackDataset = toAbsoluteFileUrl(item.dataset_path);

  return {
    id: String(item.id),
    title: item.title,
    tags: item.tags ?? [],
    owner: item.owner_name,
    ownerType: item.owner_type,
    date: new Date(item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    coverImage:
      toAbsoluteFileUrl(item.cover_image_path) ??
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    description: item.description,
    demoLink: item.demo_link ?? undefined,
    pdf: pdfs[0] ?? fallbackPdf,
    pdfs: pdfs.length > 0 ? pdfs : fallbackPdf ? [fallbackPdf] : [],
    sourceZip: sourceZips[0] ?? fallbackSourceZip,
    sourceZips:
      sourceZips.length > 0 ? sourceZips : fallbackSourceZip ? [fallbackSourceZip] : [],
    dataset: datasets[0] ?? fallbackDataset,
    datasets: datasets.length > 0 ? datasets : fallbackDataset ? [fallbackDataset] : [],
    finalDocuments,
    projectImages: finalDocuments,
    status: item.status,
    reviewComment: item.review_comment ?? undefined,
    reviewedByRole: item.reviewed_by_role ?? undefined,
    reviewedAt: item.reviewed_at
      ? new Date(item.reviewed_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : undefined,
    visibility: item.visibility,
  };
}

export function mapSubmissionToGroupHubProject(
  item: SubmissionApiRecord,
): GroupHubProject {
  const base = mapSubmissionToProject(item);
  return {
    ...base,
    projectType: item.project_type ?? null,
    teamMemberIds: item.team_member_ids ?? [],
    teamMembers: item.team_members ?? [],
    submittedByUserId: item.user_id,
    submitterName: item.user?.name ?? item.owner_name,
  };
}

export async function fetchProjectsFromApi(token: string): Promise<Project[]> {
  const response = await fetch("/api/submissions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to fetch submissions.");
  }

  const rows: SubmissionApiRecord[] = json?.data ?? [];
  return rows.map(mapSubmissionToProject);
}

export async function fetchGroupHubProjects(
  token: string,
): Promise<GroupHubProject[]> {
  const response = await fetch("/api/submissions?scope=group_hub", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to fetch group hub projects.");
  }

  const rows: SubmissionApiRecord[] = json?.data ?? [];
  return rows.map(mapSubmissionToGroupHubProject);
}

export async function fetchProjectTypes(token: string): Promise<ProjectType[]> {
  const response = await fetch("/api/project-types", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to fetch project types.");
  }

  return json?.data ?? [];
}

export async function createProjectType(
  token: string,
  name: string,
): Promise<ProjectType> {
  const response = await fetch("/api/project-types", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to create project type.");
  }

  return json?.data;
}

export async function fetchMembers(
  token: string,
): Promise<{ id: number; name: string; email: string }[]> {
  const response = await fetch("/api/members", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    return [];
  }

  return json?.data ?? json ?? [];
}

export async function deleteSubmission(
  token: string,
  submissionId: string,
): Promise<void> {
  const response = await fetch(`/api/submissions/${submissionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json?.message ?? "Failed to delete submission.");
  }
}

export async function fetchContributions(
  token: string,
  submissionId: string,
): Promise<GroupContribution[]> {
  const response = await fetch(`/api/submissions/${submissionId}/contributions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to fetch contributions.");
  }
  return json?.data ?? [];
}

export async function uploadContribution(
  token: string,
  submissionId: string,
  category: string,
  file: File,
): Promise<GroupContribution> {
  const formData = new FormData();
  formData.append("category", category);
  formData.append("file", file);

  const response = await fetch(`/api/submissions/${submissionId}/contributions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to upload contribution.");
  }
  return json?.data;
}

export async function deleteGroupContribution(
  token: string,
  contributionId: number,
): Promise<void> {
  const response = await fetch(`/api/contributions/${contributionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json?.message ?? "Failed to delete contribution.");
  }
}

export async function fetchAllContributions(
  token: string,
): Promise<GroupContribution[]> {
  const response = await fetch("/api/contributions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to fetch all contributions.");
  }
  return json?.data ?? [];
}

// ─── Team Documents (standalone — not linked to project submissions) ──────────

export async function fetchTeamDocuments(token: string): Promise<TeamDocument[]> {
  const response = await fetch("/api/team-documents", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to fetch team documents.");
  }
  return json?.data ?? [];
}

export async function createTeamDocument(
  token: string,
  payload: {
    title: string;
    description?: string;
    taggedMemberIds: number[];
    taggedMemberNames: string[];
    manualDoc?: File | null;
    sourceCode?: File | null;
    databaseFile?: File | null;
    finalDoc?: File | null;
  },
): Promise<TeamDocument> {
  const formData = new FormData();
  formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  formData.append("tagged_member_ids", JSON.stringify(payload.taggedMemberIds));
  formData.append("tagged_member_names", JSON.stringify(payload.taggedMemberNames));
  if (payload.manualDoc) formData.append("manual_doc", payload.manualDoc);
  if (payload.sourceCode) formData.append("source_code", payload.sourceCode);
  if (payload.databaseFile) formData.append("database_file", payload.databaseFile);
  if (payload.finalDoc) formData.append("final_doc", payload.finalDoc);

  const response = await fetch("/api/team-documents", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to create team document.");
  }
  return json?.data;
}

export async function deleteTeamDocument(token: string, id: number): Promise<void> {
  const response = await fetch(`/api/team-documents/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json?.message ?? "Failed to delete team document.");
  }
}

export async function inviteMember(
  token: string,
  email: string
): Promise<{ message: string }> {
  const response = await fetch("/api/members/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to invite member.");
  }
  return json;
}


