interface DashboardProps {
  token: string;
}

const Dashboard = ({ token }: DashboardProps) => {

  return (
    <div>
      <h2>Dashboard</h2>
      <p>You are logged in!</p>
      <p>Your Token starts with: {token.substring(0, 15)}...</p>
    </div>
  );
};

export default Dashboard;