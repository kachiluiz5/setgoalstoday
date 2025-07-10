"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, FileIcon as FilePdf, Upload, Download, RefreshCw, AlertTriangle, LogOut, Check } from "lucide-react"
import { loadGoals } from "@/lib/storage"
import { useToast } from "@/components/ui/use-toast"
import { downloadGoalAsText, downloadGoalAsPDF } from "@/lib/export-utils"
import {
  initializeGoogleApi,
  isSignedIn,
  signInWithGoogle,
  signOutFromGoogle,
  disconnectGoogleAccount,
  syncGoalsToGoogleDrive,
  restoreGoalsFromGoogleDrive,
  getLastSyncTime,
  setLastSyncTime,
  areCredentialsConfigured,
  getUserEmail,
  validateToken,
} from "@/lib/google-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GoogleDriveSyncProps {
  goalId: string
}

export function GoogleDriveSync({ goalId }: GoogleDriveSyncProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false)
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const { toast } = useToast()
  const [goal, setGoal] = useState<any>(null)
  const [chartRef, setChartRef] = useState<HTMLElement | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load Google API scripts
  useEffect(() => {
    const loadGoogleScripts = async () => {
      if (typeof window === "undefined" || (window as any).gapi) return

      try {
        // Load the Google API script
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://apis.google.com/js/api.js"
          script.async = true
          script.defer = true
          script.onload = () => resolve()
          script.onerror = () => reject(new Error("Failed to load Google API script"))
          document.body.appendChild(script)
        })

        // Load the Google Identity Services script
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://accounts.google.com/gsi/client"
          script.async = true
          script.defer = true
          script.onload = () => resolve()
          script.onerror = () => reject(new Error("Failed to load Google Identity Services script"))
          document.body.appendChild(script)
        })

        console.log("Google scripts loaded successfully")
        setIsInitialized(true)
      } catch (error) {
        console.error("Error loading Google scripts:", error)
      }
    }

    loadGoogleScripts()
  }, [])

  // Initialize Google API and check auth status
  useEffect(() => {
    if (!isInitialized && typeof window !== "undefined" && (window as any).gapi) {
      setIsInitialized(true)
    }

    if (!isInitialized) return

    const initializeAndCheckAuth = async () => {
      try {
        console.log("Initializing Google API...")
        await initializeGoogleApi()

        // Check if the user is signed in
        const signedIn = isSignedIn()
        console.log("User is signed in:", signedIn)
        setIsGoogleSignedIn(signedIn)

        // If signed in, validate the token and get the user email
        if (signedIn) {
          const isValid = await validateToken()
          if (isValid) {
            const email = await getUserEmail()
            setUserEmail(email)
            console.log("User email:", email)
          } else {
            console.log("Token is invalid, user will need to sign in again")
            setIsGoogleSignedIn(false)
          }
        }
      } catch (error) {
        console.error("Error during initialization:", error)
      }
    }

    initializeAndCheckAuth()
  }, [isInitialized])

  // Load goal and sync time
  useEffect(() => {
    // Load the current goal
    const goals = loadGoals()
    const currentGoal = goals.find((g) => g.id === goalId)
    if (currentGoal) {
      setGoal(currentGoal)
    }

    // Find the chart element for PDF export
    const chartElement = document.querySelector(".goal-chart-container") as HTMLElement
    if (chartElement) {
      setChartRef(chartElement)
    }

    // Get last sync time
    const syncTime = getLastSyncTime()
    if (syncTime) {
      setLastSyncDate(syncTime)
    }
  }, [goalId])

  const handleSignIn = async () => {
    setIsLoading(true)
    setAuthError(null)

    if (!areCredentialsConfigured()) {
      setAuthError("CREDENTIALS_NOT_CONFIGURED")
      setIsLoading(false)
      return
    }

    const result = await signInWithGoogle()
    setIsGoogleSignedIn(result.success)

    if (result.success) {
      // Get the user email
      const email = await getUserEmail()
      setUserEmail(email)

      toast({
        title: "Signed in successfully",
        description: "You can now sync your goals with Google Drive",
      })
    } else {
      if (result.error === "CREDENTIALS_NOT_CONFIGURED") {
        setAuthError("CREDENTIALS_NOT_CONFIGURED")
      } else if (result.error === "invalid_client") {
        setAuthError("INVALID_CLIENT")
      } else {
        setAuthError("GENERAL_ERROR")
        toast({
          title: "Sign in failed",
          description: "Could not sign in with Google. Please try again.",
          variant: "destructive",
        })
      }
    }
    setIsLoading(false)
  }

  const handleSignOut = () => {
    signOutFromGoogle()
    setIsGoogleSignedIn(false)
    setUserEmail(null)
    toast({
      title: "Signed out",
      description: "You have been signed out from Google",
    })
  }

  const handleDisconnect = () => {
    disconnectGoogleAccount()
    setIsGoogleSignedIn(false)
    setUserEmail(null)
    toast({
      title: "Account disconnected",
      description: "Your Google account has been disconnected. You can now connect with a different account.",
    })
  }

  const handleSync = async () => {
    setIsSyncing(true)
    const success = await syncGoalsToGoogleDrive()

    if (success) {
      setLastSyncTime()
      setLastSyncDate(new Date().toISOString())
      toast({
        title: "Sync successful",
        description: "Your goals have been saved to Google Drive",
      })
    } else {
      toast({
        title: "Sync failed",
        description: "Could not sync goals to Google Drive. Please try again.",
        variant: "destructive",
      })
    }
    setIsSyncing(false)
  }

  const handleRestore = async () => {
    setIsRestoring(true)
    const success = await restoreGoalsFromGoogleDrive()

    if (success) {
      toast({
        title: "Restore successful",
        description: "Your goals have been restored from Google Drive. Refresh the page to see changes.",
      })
    } else {
      toast({
        title: "Restore failed",
        description: "Could not restore goals from Google Drive. Please try again.",
        variant: "destructive",
      })
    }
    setIsRestoring(false)
  }

  const handleExportTxt = () => {
    if (!goal) return

    try {
      downloadGoalAsText(goal)
      toast({
        title: "Export successful",
        description: "Your goal has been exported as a text file.",
      })
    } catch (error) {
      console.error("Error exporting goal:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportPdf = async () => {
    if (!goal) return

    try {
      setIsLoading(true)
      await downloadGoalAsPDF(goal, chartRef)
      toast({
        title: "Export successful",
        description: "Your goal has been exported as a PDF file.",
      })
    } catch (error) {
      console.error("Error exporting goal:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your goal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const renderAuthErrorMessage = () => {
    if (!authError) return null

    if (authError === "CREDENTIALS_NOT_CONFIGURED") {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            Google API credentials are not configured. The application owner needs to set up proper Google OAuth
            credentials in the code.
          </AlertDescription>
        </Alert>
      )
    }

    if (authError === "INVALID_CLIENT") {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            The OAuth client was not found. This typically happens when the Google API credentials are invalid or the
            application is not properly configured in the Google Cloud Console.
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          An error occurred while trying to authenticate with Google. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-primary" />
          Google Drive Sync
        </h3>

        {renderAuthErrorMessage()}

        {isGoogleSignedIn ? (
          <div className="space-y-4">
            <Alert variant="success" className="bg-green-500/10 border-green-500/30">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Connected to Google Drive</AlertTitle>
              <AlertDescription>
                {userEmail ? `Connected as ${userEmail}` : "Your goals can now be synced across devices"}
              </AlertDescription>
            </Alert>

            {lastSyncDate && <p className="text-xs text-muted-foreground">Last synced: {formatDate(lastSyncDate)}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleSync} disabled={isSyncing} className="w-full gap-2">
                <Upload className="h-4 w-4" />
                {isSyncing ? "Syncing..." : "Sync to Google Drive"}
              </Button>

              <Button onClick={handleRestore} disabled={isRestoring} variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                {isRestoring ? "Restoring..." : "Restore from Drive"}
              </Button>
            </div>

            <div className="flex justify-between">
              <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-muted-foreground">
                Sign out
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Account Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">
              Sign in with Google to sync your goals across devices and keep them safe in your Google Drive.
            </p>
            <Button onClick={handleSignIn} disabled={isLoading || !isInitialized} className="w-full">
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-3">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={handleExportTxt} className="w-full gap-2">
            <FileText className="h-4 w-4" /> Export as Text
          </Button>

          <Button onClick={handleExportPdf} disabled={isLoading} className="w-full gap-2">
            <FilePdf className="h-4 w-4" /> {isLoading ? "Generating PDF..." : "Export as PDF"}
          </Button>
        </div>
      </div>
    </div>
  )
}
