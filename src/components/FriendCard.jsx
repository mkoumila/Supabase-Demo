export function FriendCard({ friend, onEdit, onDelete }) {
  return (
    <div className="friend-card">
      <div className="friend-header">
        <h2>{friend.name}</h2>
      </div>
      <div className="friend-info">
        <p><strong>Age:</strong> {friend.age}</p>
        <p><strong>Job:</strong> {friend.job}</p>
        <p><strong>Email:</strong> {friend.email}</p>
        <p><strong>Phone:</strong> {friend.phone}</p>
        <p><strong>Address:</strong> {friend.address}</p>
        <p><strong>Member since:</strong> {new Date(friend.created_at).toLocaleDateString()}</p>
      </div>
      {(onEdit || onDelete) && (
        <div className="button-group">
          {onEdit && (
            <button 
              onClick={() => onEdit(friend)}
              className="button button-primary"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(friend.id)}
              className="button button-danger"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
} 