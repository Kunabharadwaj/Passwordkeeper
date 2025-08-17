'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Password, CreatePasswordData } from '@/types/password'
import { generatePassword, defaultPasswordOptions, PasswordOptions } from '@/lib/passwordGenerator'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [passwords, setPasswords] = useState<Password[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<CreatePasswordData>({
    appName: '',
    username: '',
    password: ''
  })
  const [generatorOptions, setGeneratorOptions] = useState<PasswordOptions>(defaultPasswordOptions)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchPasswords()
    }
  }, [session, status, router])

  const fetchPasswords = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/passwords')
      if (response.ok) {
        const data = await response.json()
        setPasswords(data)
      }
    } catch (error) {
      console.error('Error fetching passwords:', error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newPassword = await response.json()
        setPasswords([...passwords, newPassword])
        setFormData({ appName: '', username: '', password: '' })
        setShowForm(false)
        setShowPassword(false)
      }
    } catch (error) {
      console.error('Error creating password:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/passwords/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPasswords(passwords.filter(p => p._id !== id))
      }
    } catch (error) {
      console.error('Error deleting password:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generateNewPassword = () => {
    const newPassword = generatePassword(generatorOptions)
    setFormData({ ...formData, password: newPassword })
    setShowGenerator(false)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Password Keeper</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Welcome, {session.user?.name}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Your Passwords</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              Add New Password
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Add New Password</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">App/Website Name</label>
                  <input
                    type="text"
                    value={formData.appName}
                    onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                    className="w-full p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Gmail, Facebook"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Username/Email</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-3 pr-12 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter or generate password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none touch-manipulation"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowGenerator(!showGenerator)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>

              {showGenerator && (
                <div className="mt-4 sm:mt-6 p-4 bg-white rounded-lg border">
                  <h4 className="font-medium mb-4 text-gray-800">Password Generator</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Length: {generatorOptions.length}
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        value={generatorOptions.length}
                        onChange={(e) => setGeneratorOptions({ ...generatorOptions, length: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center cursor-pointer touch-manipulation">
                        <input
                          type="checkbox"
                          checked={generatorOptions.includeUppercase}
                          onChange={(e) => setGeneratorOptions({ ...generatorOptions, includeUppercase: e.target.checked })}
                          className="mr-3 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Uppercase Letters (A-Z)</span>
                      </label>
                      <label className="flex items-center cursor-pointer touch-manipulation">
                        <input
                          type="checkbox"
                          checked={generatorOptions.includeLowercase}
                          onChange={(e) => setGeneratorOptions({ ...generatorOptions, includeLowercase: e.target.checked })}
                          className="mr-3 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Lowercase Letters (a-z)</span>
                      </label>
                      <label className="flex items-center cursor-pointer touch-manipulation">
                        <input
                          type="checkbox"
                          checked={generatorOptions.includeNumbers}
                          onChange={(e) => setGeneratorOptions({ ...generatorOptions, includeNumbers: e.target.checked })}
                          className="mr-3 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Numbers (0-9)</span>
                      </label>
                      <label className="flex items-center cursor-pointer touch-manipulation">
                        <input
                          type="checkbox"
                          checked={generatorOptions.includeSymbols}
                          onChange={(e) => setGeneratorOptions({ ...generatorOptions, includeSymbols: e.target.checked })}
                          className="mr-3 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Symbols (!@#$%^&*)</span>
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={generateNewPassword}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors w-full sm:w-auto text-sm sm:text-base"
                  >
                    Generate Password
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:flex-1"
                >
                  Save Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setShowGenerator(false)
                    setShowPassword(false)
                    setFormData({ appName: '', username: '', password: '' })
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-lg sm:text-xl text-gray-600">Loading passwords...</div>
            </div>
          ) : passwords.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-500 text-base sm:text-lg">No passwords saved yet.</div>
              <div className="text-gray-400 mt-2 text-sm sm:text-base">Add your first password to get started!</div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {passwords.map((password) => (
                <div key={password._id} className="border border-gray-200 rounded-lg p-4 sm:p-5 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg sm:text-xl text-gray-800 mb-2 break-words">{password.appName}</h3>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                          <span className="text-sm text-gray-600 sm:w-20 font-medium">Username:</span>
                          <span className="text-gray-800 text-sm sm:text-base break-all">{password.username}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <span className="text-sm text-gray-600 sm:w-20 font-medium">Password:</span>
                          <button
                            onClick={() => copyToClipboard(password.password)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto touch-manipulation"
                          >
                            Copy Password
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(password._id!)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto sm:ml-4 text-sm sm:text-base touch-manipulation"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}