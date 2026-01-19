"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/store/auth";
import { account } from "@/services/appwrite";
import { type Models, AuthenticatorType } from "appwrite";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Shield,
  Key,
  Smartphone,
  Monitor,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Save,
  LogOut,
} from "lucide-react";

export default function SecurityPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMFA, setLoadingMFA] = useState(true);
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [togglingMFA, setTogglingMFA] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaFactors, setMfaFactors] = useState<Models.MfaFactors | null>(null);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessions, setSessions] = useState<Models.Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      const sessionsList = await account.listSessions();
      setSessions(sessionsList.sessions);

      // Get current session
      const currentSession = await account.getSession({ sessionId: "current" });
      setCurrentSessionId(currentSession.$id);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  // Fetch MFA status
  const fetchMFAStatus = useCallback(async () => {
    try {
      setLoadingMFA(true);
      const factors = await account.listMFAFactors();
      setMfaFactors(factors);
      // Check if any MFA factor is enabled
      setMfaEnabled(factors.totp || factors.email || factors.phone);
    } catch (error) {
      console.error("Error fetching MFA status:", error);
    } finally {
      setLoadingMFA(false);
    }
  }, []);

  // Fetch user preferences for login alerts
  const fetchPreferences = useCallback(async () => {
    try {
      setLoadingPrefs(true);
      const prefs = await account.getPrefs();
      setLoginAlerts(prefs.loginAlerts !== false); // Default to true if not set
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoadingPrefs(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    fetchMFAStatus();
    fetchPreferences();
  }, [fetchSessions, fetchMFAStatus, fetchPreferences]);

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      await account.updatePassword({
        password: passwordForm.newPassword,
        oldPassword: passwordForm.currentPassword
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully");
    } catch (error: unknown) {
      console.error("Error changing password:", error);
      const appwriteError = error as { message?: string; type?: string };
      let errorMessage = "Failed to change password";
      if (appwriteError.type === "user_invalid_credentials") {
        errorMessage = "Current password is incorrect";
      } else if (appwriteError.message) {
        errorMessage = appwriteError.message;
      }
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await account.deleteSession({ sessionId });
      toast.success("Session revoked");
      fetchSessions();
    } catch (error) {
      console.error("Error revoking session:", error);
      toast.error("Failed to revoke session");
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      await account.deleteSessions();
      toast.success("All other sessions have been revoked");
      // Note: This will also log out current session, so user may need to log in again
      fetchSessions();
    } catch (error) {
      console.error("Error revoking sessions:", error);
      toast.error("Failed to revoke sessions");
    }
  };

  // Handle MFA toggle
  const handleMFAToggle = async (enabled: boolean) => {
    setTogglingMFA(true);
    try {
      if (enabled) {
        // Enable MFA - this will require setting up an authenticator
        await account.updateMFA({ mfa: true });
        toast.success("MFA enabled. Please set up an authenticator app.");
        // After enabling, user needs to set up TOTP authenticator
        // You could redirect to a setup page or show a modal here
      } else {
        // Disable MFA
        await account.updateMFA({ mfa: false });
        toast.success("MFA has been disabled");
      }
      setMfaEnabled(enabled);
      fetchMFAStatus();
    } catch (error) {
      console.error("Error toggling MFA:", error);
      const appwriteError = error as { message?: string };
      toast.error(appwriteError.message || "Failed to update MFA settings");
    } finally {
      setTogglingMFA(false);
    }
  };

  // Handle login alerts toggle
  const handleLoginAlertsToggle = async (enabled: boolean) => {
    try {
      const currentPrefs = await account.getPrefs();
      await account.updatePrefs({
        prefs: {
          ...currentPrefs,
          loginAlerts: enabled
        }
      });
      setLoginAlerts(enabled);
      toast.success(enabled ? "Login alerts enabled" : "Login alerts disabled");
    } catch (error) {
      console.error("Error updating login alerts:", error);
      toast.error("Failed to update login alerts");
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return "Active now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getDeviceInfo = (session: Models.Session) => {
    const browser = session.clientName || "Unknown Browser";
    const os = session.osName || "Unknown OS";
    return `${browser} on ${os}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Security</h1>
        <p className="text-muted-foreground">
          Manage your password and security settings
        </p>
      </div>

      {/* Change Password */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Change Password</h2>
            <p className="text-sm text-muted-foreground">
              Update your password regularly for better security
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <Button onClick={handlePasswordChange} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>

        {loadingMFA ? (
          <div className="flex items-center justify-center py-4">
            <Spinner className="h-5 w-5" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {mfaEnabled ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <p className="font-medium">
                    {mfaEnabled ? "2FA is enabled" : "2FA is not enabled"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mfaEnabled
                      ? "Your account has extra protection"
                      : "Enable 2FA for better security"}
                  </p>
                </div>
              </div>
              <Switch 
                checked={mfaEnabled} 
                onCheckedChange={handleMFAToggle}
                disabled={togglingMFA}
              />
            </div>
            {mfaFactors && (
              <div className="text-sm text-muted-foreground pl-4">
                <p className="font-medium mb-1">Active factors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {mfaFactors.totp && <li>Authenticator App (TOTP)</li>}
                  {mfaFactors.email && <li>Email verification</li>}
                  {mfaFactors.phone && <li>Phone verification</li>}
                  {!mfaFactors.totp && !mfaFactors.email && !mfaFactors.phone && (
                    <li>No factors configured</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Login Alerts */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Login Alerts</h2>
            <p className="text-sm text-muted-foreground">
              Get notified of new login activity
            </p>
          </div>
        </div>

        {loadingPrefs ? (
          <div className="flex items-center justify-center py-4">
            <Spinner className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email me on new login</p>
              <p className="text-sm text-muted-foreground">
                Receive an email when someone logs into your account
              </p>
            </div>
            <Switch checked={loginAlerts} onCheckedChange={handleLoginAlertsToggle} />
          </div>
        )}
      </Card>

      {/* Active Sessions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Monitor className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Active Sessions</h2>
              <p className="text-sm text-muted-foreground">
                Manage your active sessions
              </p>
            </div>
          </div>
          {sessions.length > 1 && (
            <Button variant="outline" size="sm" onClick={handleRevokeAllSessions}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out all others
            </Button>
          )}
        </div>

        {loadingSessions ? (
          <div className="flex items-center justify-center py-8">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.$id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{getDeviceInfo(session)}</p>
                      {session.$id === currentSessionId && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.countryName || "Unknown location"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLastActive(session.$createdAt)}
                      </span>
                      {session.ip && (
                        <span className="text-xs">IP: {session.ip}</span>
                      )}
                    </div>
                  </div>
                </div>
                {session.$id !== currentSessionId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRevokeSession(session.$id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active sessions found
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
