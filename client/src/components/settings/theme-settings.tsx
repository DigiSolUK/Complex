import React from 'react';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/context/auth-context';

interface ColorFieldProps {
  label: string;
  value: string;
  colorKey: string;
  onChange: (key: string, value: string) => void;
}

const ColorField = ({ label, value, colorKey, onChange }: ColorFieldProps) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={`color-${colorKey}`} className="text-right">
      {label}
    </Label>
    <div className="col-span-2 flex items-center gap-2">
      <Input
        id={`color-${colorKey}`}
        type="text"
        value={value}
        onChange={(e) => onChange(colorKey, e.target.value)}
        className="font-mono"
      />
      <div
        className="h-6 w-6 rounded-full border"
        style={{ backgroundColor: value }}
      />
    </div>
    <Input
      type="color"
      value={value}
      onChange={(e) => onChange(colorKey, e.target.value)}
      className="w-12"
    />
  </div>
);

export function ThemeSettings() {
  const { toast } = useToast();
  const {
    themeName,
    themeColors,
    isDarkMode,
    customCss,
    setTheme,
    setThemeColors,
    toggleDarkMode,
    setCustomCss,
    resetTheme,
  } = useTheme();
  const { user, isAdmin, isSuperAdmin } = useAuth();
  
  // For color editing
  const [editedColors, setEditedColors] = React.useState({ ...themeColors });
  const [editedCss, setEditedCss] = React.useState(customCss || '');
  
  // Reset form when theme changes
  React.useEffect(() => {
    setEditedColors({ ...themeColors });
    setEditedCss(customCss || '');
  }, [themeColors, customCss]);

  // Handle color change
  const handleColorChange = (key: string, value: string) => {
    setEditedColors(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply color changes
  const handleApplyColors = () => {
    setThemeColors(editedColors);
    
    toast({
      title: 'Theme colors updated',
      description: 'Your changes have been applied.',
    });
  };

  // Apply custom CSS
  const handleApplyCss = () => {
    setCustomCss(editedCss || null);
    
    toast({
      title: 'Custom CSS updated',
      description: 'Your changes have been applied.',
    });
  };

  // Save theme to server (admin only)
  const saveMutation = useMutation({
    mutationFn: async () => {
      // We'll need the tenant ID when implementing the save functionality
      // For now, we'll assume we're saving for tenant ID 1
      const tenantId = 1;
      const response = await apiRequest('PUT', `/api/tenants/${tenantId}/theme`, {
        themeName,
        themeColors,
        themeDarkMode: isDarkMode,
        themeCustomCss: customCss,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Theme saved',
        description: 'Theme settings have been saved to the server.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving theme',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Customize the appearance of your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Select a predefined theme or customize your own.
                </p>
              </div>
              <Select
                value={themeName}
                onValueChange={(value) => setTheme(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="nhs">NHS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Colors</h3>
              <p className="text-sm text-muted-foreground">
                Customize the color scheme.
              </p>
            </div>
            <div className="space-y-3">
              <ColorField
                label="Primary"
                value={editedColors.primary}
                colorKey="primary"
                onChange={handleColorChange}
              />
              <ColorField
                label="Secondary"
                value={editedColors.secondary}
                colorKey="secondary"
                onChange={handleColorChange}
              />
              <ColorField
                label="Accent"
                value={editedColors.accent}
                colorKey="accent"
                onChange={handleColorChange}
              />
              <ColorField
                label="Background"
                value={editedColors.background}
                colorKey="background"
                onChange={handleColorChange}
              />
              <ColorField
                label="Text"
                value={editedColors.text}
                colorKey="text"
                onChange={handleColorChange}
              />
              <ColorField
                label="Success"
                value={editedColors.success}
                colorKey="success"
                onChange={handleColorChange}
              />
              <ColorField
                label="Warning"
                value={editedColors.warning}
                colorKey="warning"
                onChange={handleColorChange}
              />
              <ColorField
                label="Error"
                value={editedColors.error}
                colorKey="error"
                onChange={handleColorChange}
              />
            </div>
            <Button onClick={handleApplyColors}>Apply Colors</Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Custom CSS</h3>
              <p className="text-sm text-muted-foreground">
                Add your own custom CSS styles.
              </p>
            </div>
            <Textarea
              value={editedCss}
              onChange={(e) => setEditedCss(e.target.value)}
              placeholder="/* Add your custom CSS here */"
              className="font-mono h-[200px]"
            />
            <Button onClick={handleApplyCss}>Apply CSS</Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={resetTheme}
          >
            Reset to Default
          </Button>
          {(isAdmin || isSuperAdmin) && (
            <Button 
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : "Save Theme"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
