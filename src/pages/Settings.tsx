import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Bell,
  Monitor,
  Code2,
  ArrowLeft,
  Save,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyChallenge, setDailyChallenge] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState("14");
  const [editorTheme, setEditorTheme] = useState("vs-dark");

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handlePasswordChange = () => {
    toast.success("Password change email sent!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated username="CodeMaster" />

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>

        {/* Account Settings */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription>Update your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="CodeMaster" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input id="email" type="email" defaultValue="codemaster@example.com" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Button variant="outline" onClick={handlePasswordChange}>
                Change Password
              </Button>
            </div>

            <Separator />

            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email about your account activity
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-challenge">Daily Challenge Reminder</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about the daily coding challenge
                </p>
              </div>
              <Switch
                id="daily-challenge"
                checked={dailyChallenge}
                onCheckedChange={setDailyChallenge}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-report">Weekly Progress Report</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a summary of your weekly progress
                </p>
              </div>
              <Switch
                id="weekly-report"
                checked={weeklyReport}
                onCheckedChange={setWeeklyReport}
              />
            </div>
          </CardContent>
        </Card>

        {/* Editor Preferences */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Editor Preferences
            </CardTitle>
            <CardDescription>Customize your coding environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="editor-theme">Editor Theme</Label>
              <Select value={editorTheme} onValueChange={setEditorTheme}>
                <SelectTrigger id="editor-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vs-dark">Dark (VS Code)</SelectItem>
                  <SelectItem value="vs-light">Light</SelectItem>
                  <SelectItem value="hc-black">High Contrast Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger id="font-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12px</SelectItem>
                  <SelectItem value="14">14px (Default)</SelectItem>
                  <SelectItem value="16">16px</SelectItem>
                  <SelectItem value="18">18px</SelectItem>
                  <SelectItem value="20">20px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Auto-save Code</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save your code while typing
                </p>
              </div>
              <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="glass-effect border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() =>
                  toast.error("Account deletion not available in demo")
                }
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
