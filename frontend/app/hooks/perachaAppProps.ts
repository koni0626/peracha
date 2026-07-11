import { createChatProps } from "./perachaChatProps";
import { createHomeProps } from "./perachaHomeProps";
import { createModalProps } from "./perachaModalProps";
import { createSidebarProps } from "./perachaSidebarProps";
import type {
  AuthenticatedShellProps,
  AuthScreenProps,
  CreateAuthenticatedShellPropsOptions,
  CreateAuthScreenPropsOptions
} from "./perachaAppTypes";

export type { AuthenticatedPropsOptions, AuthenticatedShellProps } from "./perachaAppTypes";

export function createAuthScreenProps({
  error,
  onSubmit,
  session
}: CreateAuthScreenPropsOptions): AuthScreenProps {
  return {
    authMode: session.authMode,
    name: session.name,
    email: session.email,
    password: session.password,
    error,
    setAuthMode: session.setAuthMode,
    setName: session.setName,
    setEmail: session.setEmail,
    setPassword: session.setPassword,
    onSubmit
  };
}

export function createAuthenticatedShellProps({
  access,
  composer,
  composerState,
  facilitator,
  files,
  logout,
  management,
  notices,
  realtime,
  session,
  setError,
  stamps,
  timeline
}: CreateAuthenticatedShellPropsOptions): AuthenticatedShellProps | null {
  if (!session.user) {
    return null;
  }

  const options = {
    access,
    composer,
    composerState,
    facilitator,
    files,
    logout,
    management,
    notices,
    realtime,
    session,
    setError,
    stamps,
    timeline,
    user: session.user
  };

  return {
    activeRoom: management.activeRoom,
    sidebar: createSidebarProps(options),
    modals: createModalProps(options),
    chat: createChatProps(options),
    home: createHomeProps(options)
  };
}
