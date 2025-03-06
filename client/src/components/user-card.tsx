import type React from "react"

interface UserCardProps {
  userId: number
  fullName: string
  avatarUrl?: string
  reputation?: number
  date: string
  action: string
}

const UserCard: React.FC<UserCardProps> = ({ userId, fullName, avatarUrl, reputation, date, action }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="flex items-center mt-4 text-sm text-gray-600">
      <div className="flex-shrink-0 mr-2">
        <img
          src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`}
          alt={fullName}
          className="w-8 h-8 rounded-md"
        />
      </div>
      <div>
        <span className="font-medium text-blue-600">{fullName}</span>
        {reputation !== undefined && (
          <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{reputation}</span>
        )}
        <div className="text-xs">
          {action} {formatDate(date)}
        </div>
      </div>
    </div>
  )
}

export default UserCard

