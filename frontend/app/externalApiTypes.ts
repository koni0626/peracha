export type ApiClient = {
  id: string;
  room_id: string | null;
  name: string;
  client_type: string;
  scopes: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ApiToken = {
  id: string;
  api_client_id: string;
  name: string | null;
  token: string | null;
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

export type AuditLog = {
  id: string;
  api_client_id: string | null;
  api_token_id: string | null;
  room_id: string | null;
  actor_type: string;
  action: string;
  method: string;
  path: string;
  resource_type: string | null;
  resource_id: string | null;
  status: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};
