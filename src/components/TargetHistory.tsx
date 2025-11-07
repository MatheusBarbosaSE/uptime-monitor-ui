interface TargetHistoryProps {
  token: string;
  targetId: number;
  onBack: () => void;
}

const TargetHistory = ({ token, targetId, onBack }: TargetHistoryProps) => {

  return (
    <div>
      <button onClick={onBack}>&larr; Back to Dashboard</button>
      
      <h2>History for Target ID: {targetId}</h2>
      <p>Loading history...</p>
    </div>
  );
};

export default TargetHistory;