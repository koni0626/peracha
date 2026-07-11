import type { Dispatch, SetStateAction } from "react";

import type { ApiClient } from "../types";

export type ApiClientManagementOptions = {
  activeRoomId: string | null;
  setApiNotice: (message: string | null) => void;
  setError: (message: string | null) => void;
};

export type ApiClientMutationState = ApiClientManagementOptions & {
  selectedApiClientId: string | null;
  setApiClients: Dispatch<SetStateAction<ApiClient[]>>;
  setSelectedApiClientId: Dispatch<SetStateAction<string | null>>;
};

export type ApiClientCreationState = ApiClientMutationState & {
  newApiClientName: string;
  newApiClientType: string;
};
