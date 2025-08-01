export default function TestEnvPage() {
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const hasJwtSecret = !!process.env.JWT_SECRET;
  const hasAdminUsername = !!process.env.ADMIN_USERNAME;
  const hasAdminPasswordHash = !!process.env.ADMIN_PASSWORD_HASH;
  const hasAppUrl = !!process.env.NEXT_PUBLIC_APP_URL;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Environment Variables Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables Status</h2>
          
          <div className="space-y-3">
            <div className={`flex items-center p-3 rounded ${hasDatabaseUrl ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 ${hasDatabaseUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <div className="font-medium">DATABASE_URL</div>
                <div className="text-sm text-gray-600">
                  {hasDatabaseUrl ? '✅ Set' : '❌ Not Set'}
                </div>
              </div>
            </div>

            <div className={`flex items-center p-3 rounded ${hasJwtSecret ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 ${hasJwtSecret ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <div className="font-medium">JWT_SECRET</div>
                <div className="text-sm text-gray-600">
                  {hasJwtSecret ? '✅ Set' : '❌ Not Set'}
                </div>
              </div>
            </div>

            <div className={`flex items-center p-3 rounded ${hasAdminUsername ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 ${hasAdminUsername ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <div className="font-medium">ADMIN_USERNAME</div>
                <div className="text-sm text-gray-600">
                  {hasAdminUsername ? '✅ Set' : '❌ Not Set'}
                </div>
              </div>
            </div>

            <div className={`flex items-center p-3 rounded ${hasAdminPasswordHash ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 ${hasAdminPasswordHash ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <div className="font-medium">ADMIN_PASSWORD_HASH</div>
                <div className="text-sm text-gray-600">
                  {hasAdminPasswordHash ? '✅ Set' : '❌ Not Set'}
                </div>
              </div>
            </div>

            <div className={`flex items-center p-3 rounded ${hasAppUrl ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 ${hasAppUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <div className="font-medium">NEXT_PUBLIC_APP_URL</div>
                <div className="text-sm text-gray-600">
                  {hasAppUrl ? '✅ Set' : '❌ Not Set'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-medium text-blue-900 mb-2">Next Steps</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• If any variables show ❌ Not Set, you need to set them in Vercel</p>
              <p>• Go to Vercel Dashboard → Your Project → Settings → Environment Variables</p>
              <p>• Set all variables for Production, Preview, and Development environments</p>
              <p>• After setting variables, redeploy with: <code className="bg-blue-100 px-1 rounded">vercel --prod</code></p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-medium text-yellow-900 mb-2">Required Environment Variables</h3>
            <div className="text-sm text-yellow-800 space-y-1">
              <p><strong>DATABASE_URL:</strong> postgres://dc11a19a121b28f6ebb7ee2e49844fb04f4632aaccc72ad37d6113a73cf9d5d8:sk_RZubdFMNiUSdi32xwMvSU@db.prisma.io:5432/?sslmode=require</p>
              <p><strong>JWT_SECRET:</strong> f39e866b5516b80cbfcfeba022a24fa6890bce80aff50f806705eeb55a560d7bcecc9c30660859a2c4e1df61146b0fe3d321d531edc0f0af616652ce528bb591</p>
              <p><strong>ADMIN_USERNAME:</strong> admin</p>
              <p><strong>ADMIN_PASSWORD_HASH:</strong> $2b$10$i4W7rcyNR1VdYEOweHqmA.4Fk.IFFjrH6Oux.ChTKH2arlOVqtXPO</p>
              <p><strong>NEXT_PUBLIC_APP_URL:</strong> https://finance-app-b2z21h7cc-aradhana-kurups-projects.vercel.app</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 