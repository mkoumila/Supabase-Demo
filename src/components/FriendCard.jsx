export function FriendCard({ friend, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden ">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {friend.name}
        </h2>

        <div className="space-y-2 text-gray-600">
          <p className="flex">
            <span className="font-medium w-24">Age:</span>
            <span>{friend.age}</span>
          </p>
          <p className="flex">
            <span className="font-medium w-24">Job:</span>
            <span>{friend.job}</span>
          </p>
          <p className="flex">
            <span className="font-medium w-24">Email:</span>
            <span className="text-blue-600">{friend.email}</span>
          </p>
          <p className="flex">
            <span className="font-medium w-24">Phone:</span>
            <span>{friend.phone}</span>
          </p>
          <p className="flex">
            <span className="font-medium w-24">Address:</span>
            <span>{friend.address}</span>
          </p>
          <p className="flex text-sm text-gray-500">
            <span className="font-medium w-24">Member since:</span>
            <span>{new Date(friend.created_at).toLocaleDateString()}</span>
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="mt-6 flex space-x-3">
            {onEdit && (
              <button
                onClick={() => onEdit(friend)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(friend.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
