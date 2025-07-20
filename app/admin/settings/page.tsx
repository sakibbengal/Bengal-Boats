"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/image-upload"
import { useSiteSettings } from "@/contexts/site-settings-context"
import { AdminLayout } from "@/components/admin/admin-layout"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminSettingsPage() {
  const { settings, updateSettings, isLoaded, isLoading } = useSiteSettings()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings({})
      toast({
        title: "Settings saved",
        description: "Your site settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (field: string, imageUrl: string) => {
    try {
      await updateSettings({ [field]: imageUrl })
      toast({
        title: "Image updated",
        description: "Your image has been uploaded and updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update image. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Show loading skeleton while settings are loading
  if (!isLoaded) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage your website settings and appearance. Images are uploaded to the server and changes appear
            immediately.
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic information about your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => updateSettings({ siteName: e.target.value })}
                      placeholder="Your site name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={settings.siteUrl}
                      onChange={(e) => updateSettings({ siteUrl: e.target.value })}
                      placeholder="https://yoursite.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                    placeholder="Brief description of your website"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section Settings</CardTitle>
                <CardDescription>Customize the main hero section text and button</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={settings.heroTitle}
                    onChange={(e) => updateSettings({ heroTitle: e.target.value })}
                    placeholder="Explore Modern RC Adventures"
                  />
                  <p className="text-sm text-muted-foreground">Main heading text in the hero section</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={settings.heroSubtitle}
                    onChange={(e) => updateSettings({ heroSubtitle: e.target.value })}
                    placeholder="SHOP NOW TODAY"
                  />
                  <p className="text-sm text-muted-foreground">Small text above the main title</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroButtonText">Hero Button Text</Label>
                  <Input
                    id="heroButtonText"
                    value={settings.heroButtonText}
                    onChange={(e) => updateSettings({ heroButtonText: e.target.value })}
                    placeholder="Shop Now"
                  />
                  <p className="text-sm text-muted-foreground">Text displayed on the hero section button</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Image Settings</CardTitle>
                <CardDescription>
                  Upload and manage your website images. Images are saved to the server and changes appear immediately.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold">Logo</Label>
                    <p className="text-sm text-muted-foreground mb-2">Upload your site logo (appears in header)</p>
                    <ImageUpload
                      category="logo"
                      currentImage={settings.logo}
                      onImageUpload={(imageUrl) => handleImageUpload("logo", imageUrl)}
                    />
                  </div>
                  <div>
                    <Label className="text-base font-semibold">Favicon</Label>
                    <p className="text-sm text-muted-foreground mb-2">Upload your favicon (32x32px recommended)</p>
                    <ImageUpload
                      category="favicon"
                      currentImage={settings.favicon}
                      onImageUpload={(imageUrl) => handleImageUpload("favicon", imageUrl)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Hero Section</h3>
                    <p className="text-sm text-muted-foreground">Background image for the main hero section</p>
                  </div>
                  <ImageUpload
                    category="hero"
                    currentImage={settings.heroImage}
                    onImageUpload={(imageUrl) => handleImageUpload("heroImage", imageUrl)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Category Images</h3>
                    <p className="text-sm text-muted-foreground">Images for the three category cards on homepage</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Category 1 (RC Boats)</Label>
                      <ImageUpload
                        category="category1"
                        currentImage={settings.categoryImage1}
                        onImageUpload={(imageUrl) => handleImageUpload("categoryImage1", imageUrl)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Category 2 (RC Planes)</Label>
                      <ImageUpload
                        category="category2"
                        currentImage={settings.categoryImage2}
                        onImageUpload={(imageUrl) => handleImageUpload("categoryImage2", imageUrl)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Category 3 (RC Cars)</Label>
                      <ImageUpload
                        category="category3"
                        currentImage={settings.categoryImage3}
                        onImageUpload={(imageUrl) => handleImageUpload("categoryImage3", imageUrl)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">About Section</h3>
                    <p className="text-sm text-muted-foreground">Image for the about section on homepage</p>
                  </div>
                  <ImageUpload
                    category="about"
                    currentImage={settings.aboutImage}
                    onImageUpload={(imageUrl) => handleImageUpload("aboutImage", imageUrl)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update your contact details (will appear in footer)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                      placeholder="contact@yoursite.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => updateSettings({ contactPhone: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) => updateSettings({ address: e.target.value })}
                    placeholder="Your business address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Add your social media links (will appear in footer)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={settings.socialMedia.facebook}
                    onChange={(e) =>
                      updateSettings({
                        socialMedia: { ...settings.socialMedia, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={settings.socialMedia.instagram}
                    onChange={(e) =>
                      updateSettings({
                        socialMedia: { ...settings.socialMedia, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    value={settings.socialMedia.youtube}
                    onChange={(e) =>
                      updateSettings({
                        socialMedia: { ...settings.socialMedia, youtube: e.target.value },
                      })
                    }
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
