import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const ContactMessages = ({ token }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    page: 1
  })
  const [stats, setStats] = useState({
    new: 0,
    read: 0,
    replied: 0,
    resolved: 0,
    archived: 0
  })
  const [pagination, setPagination] = useState({})
  const [selectedMessages, setSelectedMessages] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      if (filters.status !== 'all') queryParams.append('status', filters.status)
      if (filters.priority !== 'all') queryParams.append('priority', filters.priority)
      if (filters.search) queryParams.append('search', filters.search)
      queryParams.append('page', filters.page)
      queryParams.append('limit', '10')

      const response = await axios.get(`${backendUrl}/api/contact/admin/all?${queryParams}`, {
        headers: { token }
      })

      if (response.data.success) {
        setMessages(response.data.messages)
        setStats(response.data.stats)
        setPagination(response.data.pagination)
      } else {
        toast.error('Failed to fetch messages')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Error fetching messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [filters])

  // Update message status
  const updateMessageStatus = async (messageId, status, priority = null) => {
    try {
      const data = { status }
      if (priority) data.priority = priority

      const response = await axios.put(`${backendUrl}/api/contact/admin/${messageId}/status`, data, {
        headers: { token }
      })

      if (response.data.success) {
        toast.success('Message updated successfully')
        fetchMessages()
        if (selectedMessage && selectedMessage._id === messageId) {
          setSelectedMessage(response.data.updatedMessage)
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error updating message:', error)
      toast.error('Error updating message')
    }
  }

  // Reply to message
  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message')
      return
    }

    try {
      setIsReplying(true)
      const response = await axios.post(`${backendUrl}/api/contact/admin/${selectedMessage._id}/reply`, {
        replyMessage: replyText,
        adminName: 'Admin' // You can get this from user context
      }, {
        headers: { token }
      })

      if (response.data.success) {
        toast.success('Reply sent successfully')
        setShowReplyModal(false)
        setReplyText('')
        fetchMessages()
        // Update selected message status
        setSelectedMessage(prev => ({ ...prev, status: 'replied' }))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Error sending reply')
    } finally {
      setIsReplying(false)
    }
  }

  // Delete message
  const deleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await axios.delete(`${backendUrl}/api/contact/admin/${messageId}`, {
        headers: { token }
      })

      if (response.data.success) {
        toast.success('Message deleted successfully')
        fetchMessages()
        if (selectedMessage && selectedMessage._id === messageId) {
          setSelectedMessage(null)
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Error deleting message')
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
      resolved: 'bg-purple-100 text-purple-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  // Bulk actions
  const handleBulkAction = async (action, value = null) => {
    if (selectedMessages.length === 0) {
      toast.error('Please select messages first')
      return
    }

    try {
      const data = { messageIds: selectedMessages, action }
      if (value) {
        if (action === 'update_status') data.status = value
        if (action === 'update_priority') data.priority = value
      }

      const response = await axios.put(`${backendUrl}/api/contact/admin/bulk-update`, data, {
        headers: { token }
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setSelectedMessages([])
        setShowBulkActions(false)
        fetchMessages()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error with bulk action:', error)
      toast.error('Error performing bulk action')
    }
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Contact Messages</h1>
        <p className='text-gray-600'>Manage customer inquiries and messages</p>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-8'>
        <div className='bg-white p-4 rounded-lg shadow border'>
          <div className='text-2xl font-bold text-blue-600'>{stats.new}</div>
          <div className='text-sm text-gray-600'>New</div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow border'>
          <div className='text-2xl font-bold text-yellow-600'>{stats.read}</div>
          <div className='text-sm text-gray-600'>Read</div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow border'>
          <div className='text-2xl font-bold text-green-600'>{stats.replied}</div>
          <div className='text-sm text-gray-600'>Replied</div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow border'>
          <div className='text-2xl font-bold text-purple-600'>{stats.resolved}</div>
          <div className='text-sm text-gray-600'>Resolved</div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow border'>
          <div className='text-2xl font-bold text-gray-600'>{stats.archived}</div>
          <div className='text-sm text-gray-600'>Archived</div>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white p-4 rounded-lg shadow border mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Search</label>
            <input
              type='text'
              placeholder='Search messages...'
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className='w-full px-3 py-2 border rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className='w-full px-3 py-2 border rounded-md'
            >
              <option value='all'>All Status</option>
              <option value='new'>New</option>
              <option value='read'>Read</option>
              <option value='replied'>Replied</option>
              <option value='resolved'>Resolved</option>
              <option value='archived'>Archived</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value, page: 1 }))}
              className='w-full px-3 py-2 border rounded-md'
            >
              <option value='all'>All Priority</option>
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
              <option value='urgent'>Urgent</option>
            </select>
          </div>
          <div className='flex items-end'>
            <button
              onClick={() => setFilters({ status: 'all', priority: 'all', search: '', page: 1 })}
              className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600'
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <div className='bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-blue-800'>
              {selectedMessages.length} message(s) selected
            </span>
            <div className='flex gap-2'>
              <button
                onClick={() => handleBulkAction('mark_read')}
                className='px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600'
              >
                Mark Read
              </button>
              <button
                onClick={() => handleBulkAction('mark_resolved')}
                className='px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600'
              >
                Mark Resolved
              </button>
              <button
                onClick={() => handleBulkAction('archive')}
                className='px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600'
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Messages List */}
        <div className='bg-white rounded-lg shadow border'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold'>Messages</h2>
          </div>
          
          <div className='max-h-96 overflow-y-auto'>
            {loading ? (
              <div className='p-8 text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
                <p className='mt-2 text-gray-600'>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className='p-8 text-center text-gray-500'>
                No messages found
              </div>
            ) : (
              <div className='divide-y'>
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedMessage?._id === message._id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          checked={selectedMessages.includes(message._id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            if (e.target.checked) {
                              setSelectedMessages(prev => [...prev, message._id])
                            } else {
                              setSelectedMessages(prev => prev.filter(id => id !== message._id))
                            }
                          }}
                          className='rounded'
                        />
                        <h3 className='font-medium text-gray-900'>{message.name}</h3>
                      </div>
                      <div className='flex gap-1'>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      </div>
                    </div>
                    <p className='text-sm text-gray-600 mb-1'>{message.email}</p>
                    <p className='text-sm text-gray-800 font-medium mb-2'>{message.subject}</p>
                    <p className='text-sm text-gray-600 line-clamp-2'>{message.message}</p>
                    <p className='text-xs text-gray-500 mt-2'>{formatDate(message.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className='p-4 border-t flex items-center justify-between'>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrev}
                className='px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50'
              >
                Previous
              </button>
              <span className='text-sm text-gray-600'>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNext}
                className='px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50'
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Message Details */}
        <div className='bg-white rounded-lg shadow border'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold'>Message Details</h2>
          </div>
          
          {selectedMessage ? (
            <div className='p-4'>
              <div className='mb-4'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-xl font-semibold'>{selectedMessage.name}</h3>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setShowReplyModal(true)}
                      className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMessage._id)}
                      className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block text-sm font-medium mb-1'>Email</label>
                    <p className='text-sm text-gray-900'>{selectedMessage.email}</p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-1'>Date</label>
                    <p className='text-sm text-gray-900'>{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-1'>Status</label>
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => updateMessageStatus(selectedMessage._id, e.target.value)}
                      className='w-full px-2 py-1 border rounded text-sm'
                    >
                      <option value='new'>New</option>
                      <option value='read'>Read</option>
                      <option value='replied'>Replied</option>
                      <option value='resolved'>Resolved</option>
                      <option value='archived'>Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-1'>Priority</label>
                    <select
                      value={selectedMessage.priority}
                      onChange={(e) => updateMessageStatus(selectedMessage._id, selectedMessage.status, e.target.value)}
                      className='w-full px-2 py-1 border rounded text-sm'
                    >
                      <option value='low'>Low</option>
                      <option value='medium'>Medium</option>
                      <option value='high'>High</option>
                      <option value='urgent'>Urgent</option>
                    </select>
                  </div>
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-1'>Subject</label>
                  <p className='text-sm text-gray-900 font-medium'>{selectedMessage.subject}</p>
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-1'>Message</label>
                  <div className='bg-gray-50 p-3 rounded border'>
                    <p className='text-sm text-gray-900 whitespace-pre-wrap'>{selectedMessage.message}</p>
                  </div>
                </div>

                {selectedMessage.respondedBy && (
                  <div className='bg-green-50 p-3 rounded border border-green-200'>
                    <p className='text-sm text-green-800'>
                      Replied by {selectedMessage.respondedBy} on {formatDate(selectedMessage.responseDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='p-8 text-center text-gray-500'>
              Select a message to view details
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-lg mx-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold'>Reply to {selectedMessage?.name}</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                ✕
              </button>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>Your Reply</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder='Type your reply here...'
                rows={6}
                className='w-full px-3 py-2 border rounded-md resize-none'
              />
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => setShowReplyModal(false)}
                className='flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={isReplying || !replyText.trim()}
                className='flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isReplying ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactMessages