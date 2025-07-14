import { Plus } from 'lucide-react'

const StoryBar = () => {
  const stories = [
    {
      id: 1,
      user: {
        name: 'Your Story',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
        isOwn: true
      }
    },
    {
      id: 2,
      user: {
        name: 'Sarah J.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
        hasStory: true
      }
    },
    {
      id: 3,
      user: {
        name: 'Mike C.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
        hasStory: true
      }
    },
    {
      id: 4,
      user: {
        name: 'Emma W.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
        hasStory: true
      }
    },
    {
      id: 5,
      user: {
        name: 'Alex R.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
        hasStory: false
      }
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {stories.map(story => (
          <div key={story.id} className="flex flex-col items-center space-y-2 min-w-0">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full p-0.5 ${
                story.user.isOwn 
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-500' 
                  : story.user.hasStory 
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500' 
                    : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 p-0.5">
                  {story.user.isOwn ? (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Plus className="text-gray-500" size={24} />
                    </div>
                  ) : (
                    <img
                      src={story.user.avatar}
                      alt={story.user.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center truncate w-16">
              {story.user.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoryBar 