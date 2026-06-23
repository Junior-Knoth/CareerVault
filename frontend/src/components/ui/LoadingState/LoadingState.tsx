import './LoadingState.scss';

export default function LoadingState({ message }: { message?: string }) {
  return (
    <div className="loadingState" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true"></span>
      {message && <p>{message}</p>}
    </div>
  );
}
