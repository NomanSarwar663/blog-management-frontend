import ProtectedRoute from "./ProtectedRoute";

const withAuth = (WrappedComponent, options = {}) => {
  const { roles = [] } = options;

  const GuardedComponent = (props) => (
    <ProtectedRoute roles={roles}>
      <WrappedComponent {...props} />
    </ProtectedRoute>
  );

  GuardedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return GuardedComponent;
};

export default withAuth;
