export type SavingMutationOptions = {
  fallbackError: string;
  formatError?: (err: unknown, fallbackError: string) => string;
  setError: (message: string | null) => void;
  setSaving: (saving: boolean) => void;
};

export async function runSavingMutation(
  { fallbackError, formatError = getErrorMessage, setError, setSaving }: SavingMutationOptions,
  action: () => Promise<void>
) {
  setSaving(true);
  setError(null);
  try {
    await action();
  } catch (err) {
    setError(formatError(err, fallbackError));
  } finally {
    setSaving(false);
  }
}

export function getErrorMessage(err: unknown, fallbackError: string) {
  return err instanceof Error ? err.message : fallbackError;
}
