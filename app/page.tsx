"use client"

import { useState } from "react"
import { GripVertical, X, Download, Save, Upload, Plus, Settings, Eye, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

interface ContentBlock {
  id: string
  type: "text" | "heading" | "image" | "table" | "grid"
  content: any
  settings: {
    className?: string
    style?: Record<string, any>
    responsive?: {
      desktop?: Record<string, any>
      tablet?: Record<string, any>
      mobile?: Record<string, any>
    }
  }
  children?: ContentBlock[]
}

interface FormSection {
  id: string
  title: string
  settings: {
    backgroundColor?: string
    padding?: number
    margin?: number
    fullWidth?: boolean
  }
  blocks: ContentBlock[]
  isExpanded: boolean
}

const contentTypes = [
  { type: "text", label: "Text", icon: "📝" },
  { type: "heading", label: "Heading", icon: "📰" },
  { type: "image", label: "Image", icon: "🖼️" },
  { type: "table", label: "Table", icon: "📊" },
  { type: "grid", label: "Grid", icon: "⚏" },
]

const headingLevels = [
  { value: "h1", label: "H1 - Main Title" },
  { value: "h2", label: "H2 - Section Title" },
  { value: "h3", label: "H3 - Subsection" },
  { value: "h4", label: "H4 - Minor Heading" },
  { value: "h5", label: "H5 - Small Heading" },
  { value: "h6", label: "H6 - Tiny Heading" },
]

export default function DynamicLandingGenerator() {
  const [sections, setSections] = useState<FormSection[]>([
    {
      id: "1",
      title: "Hero Section",
      settings: {
        backgroundColor: "#3b82f6",
        padding: 80,
        margin: 0,
        fullWidth: true,
      },
      blocks: [
        {
          id: "block-1",
          type: "heading",
          content: {
            text: "Welcome to Our Platform",
            level: "h1",
          },
          settings: {
            style: { color: "white", textAlign: "center", marginBottom: "24px" },
          },
        },
        {
          id: "block-2",
          type: "text",
          content: {
            text: "Transform your business with our innovative solution",
          },
          settings: {
            style: { color: "white", textAlign: "center", fontSize: "18px", marginBottom: "32px" },
          },
        },
      ],
      isExpanded: true,
    },
  ])

  const [activeTab, setActiveTab] = useState("preview")
  const [previewMode, setPreviewMode] = useState("desktop")
  const [selectedSection, setSelectedSection] = useState<string>("")
  const [selectedBlock, setSelectedBlock] = useState<string>("")

  const addSection = () => {
    const newSection: FormSection = {
      id: Date.now().toString(),
      title: "New Section",
      settings: {
        backgroundColor: "#ffffff",
        padding: 40,
        margin: 0,
        fullWidth: true,
      },
      blocks: [],
      isExpanded: true,
    }
    setSections([...sections, newSection])
  }

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id))
  }

  const toggleSection = (id: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, isExpanded: !s.isExpanded } : s)))
  }

  const updateSectionSettings = (id: string, field: string, value: any) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, settings: { ...s.settings, [field]: value } } : s)))
  }

  const updateSectionTitle = (id: string, title: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, title } : s)))
  }

  const addContentBlock = (sectionId: string, type: string, parentId?: string) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type: type as any,
      content: getDefaultContent(type),
      settings: getDefaultSettings(type),
      children: type === "grid" ? [] : undefined,
    }

    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          if (parentId) {
            // Add to grid
            return {
              ...section,
              blocks: addBlockToParent(section.blocks, parentId, newBlock),
            }
          } else {
            // Add to section
            return {
              ...section,
              blocks: [...section.blocks, newBlock],
            }
          }
        }
        return section
      }),
    )
  }

  const addBlockToParent = (blocks: ContentBlock[], parentId: string, newBlock: ContentBlock): ContentBlock[] => {
    return blocks.map((block) => {
      if (block.id === parentId && block.type === "grid") {
        return {
          ...block,
          children: [...(block.children || []), newBlock],
        }
      }
      if (block.children) {
        return {
          ...block,
          children: addBlockToParent(block.children, parentId, newBlock),
        }
      }
      return block
    })
  }

  const removeContentBlock = (sectionId: string, blockId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            blocks: removeBlockFromList(section.blocks, blockId),
          }
        }
        return section
      }),
    )
  }

  const removeBlockFromList = (blocks: ContentBlock[], blockId: string): ContentBlock[] => {
    return blocks
      .filter((block) => block.id !== blockId)
      .map((block) => {
        if (block.children) {
          return {
            ...block,
            children: removeBlockFromList(block.children, blockId),
          }
        }
        return block
      })
  }

  const updateBlockContent = (sectionId: string, blockId: string, field: string, value: any) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            blocks: updateBlockInList(section.blocks, blockId, field, value),
          }
        }
        return section
      }),
    )
  }

  const updateBlockInList = (blocks: ContentBlock[], blockId: string, field: string, value: any): ContentBlock[] => {
    return blocks.map((block) => {
      if (block.id === blockId) {
        return {
          ...block,
          content: { ...block.content, [field]: value },
        }
      }
      if (block.children) {
        return {
          ...block,
          children: updateBlockInList(block.children, blockId, field, value),
        }
      }
      return block
    })
  }

  const updateBlockSettings = (sectionId: string, blockId: string, settings: any) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            blocks: updateBlockSettingsInList(section.blocks, blockId, settings),
          }
        }
        return section
      }),
    )
  }

  const updateBlockSettingsInList = (blocks: ContentBlock[], blockId: string, settings: any): ContentBlock[] => {
    return blocks.map((block) => {
      if (block.id === blockId) {
        return {
          ...block,
          settings: { ...block.settings, ...settings },
        }
      }
      if (block.children) {
        return {
          ...block,
          children: updateBlockSettingsInList(block.children, blockId, settings),
        }
      }
      return block
    })
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(sections, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "landing-page.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Dynamic Landing Builder</h1>
            <Button onClick={addSection} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Load
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={exportJSON}>
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Structure & Content */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <Tabs defaultValue="structure" className="h-full">
            <TabsList className="grid w-full grid-cols-2 m-2">
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-gray-900">Sections ({sections.length})</h2>
                <Badge variant="secondary">{sections.length}</Badge>
              </div>

              <div className="space-y-3">
                {sections.map((section) => (
                  <SectionStructure
                    key={section.id}
                    section={section}
                    onToggle={() => toggleSection(section.id)}
                    onRemove={() => removeSection(section.id)}
                    onUpdateTitle={(title) => updateSectionTitle(section.id, title)}
                    onAddBlock={(type, parentId) => addContentBlock(section.id, type, parentId)}
                    onRemoveBlock={(blockId) => removeContentBlock(section.id, blockId)}
                    onUpdateBlock={(blockId, field, value) => updateBlockContent(section.id, blockId, field, value)}
                    onSelectBlock={setSelectedBlock}
                    selectedBlock={selectedBlock}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4">
              {selectedBlock ? (
                <BlockSettings
                  block={findBlockById(sections, selectedBlock)}
                  onUpdateSettings={(settings) => {
                    const sectionId = findSectionIdByBlockId(sections, selectedBlock)
                    if (sectionId) {
                      updateBlockSettings(sectionId, selectedBlock, settings)
                    }
                  }}
                />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Select a content block to edit settings</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side - Preview */}
        <div className="flex-1 bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
              <TabsList>
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="json">
                  <Code className="w-4 h-4 mr-2" />
                  JSON
                </TabsTrigger>
              </TabsList>

              {activeTab === "preview" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Live Preview • {sections.length} Sections</span>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant={previewMode === "desktop" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("desktop")}
                    >
                      Desktop
                    </Button>
                    <Button
                      variant={previewMode === "tablet" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("tablet")}
                    >
                      Tablet
                    </Button>
                    <Button
                      variant={previewMode === "mobile" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("mobile")}
                    >
                      Mobile
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <TabsContent value="preview" className="flex-1 p-6 overflow-y-auto">
              <div
                className={`mx-auto transition-all duration-300 ${
                  previewMode === "mobile" ? "max-w-sm" : previewMode === "tablet" ? "max-w-2xl" : "max-w-6xl"
                }`}
              >
                <LandingPagePreview sections={sections} />
              </div>
            </TabsContent>

            <TabsContent value="json" className="flex-1 p-6">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto h-full">
                {JSON.stringify(sections, null, 2)}
              </pre>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function SectionStructure({
  section,
  onToggle,
  onRemove,
  onUpdateTitle,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onSelectBlock,
  selectedBlock,
}: {
  section: FormSection
  onToggle: () => void
  onRemove: () => void
  onUpdateTitle: (title: string) => void
  onAddBlock: (type: string, parentId?: string) => void
  onRemoveBlock: (blockId: string) => void
  onUpdateBlock: (blockId: string, field: string, value: any) => void
  onSelectBlock: (blockId: string) => void
  selectedBlock: string
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg">
      {/* Section Header */}
      <div className="flex items-center justify-between p-3 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <Input
            value={section.title}
            onChange={(e) => {
              e.stopPropagation()
              onUpdateTitle(e.target.value)
            }}
            className="text-sm font-medium border-none bg-transparent p-0 h-auto"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-xs">
            {section.blocks.length} blocks
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Section Content */}
      {section.isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          <Separator />

          {/* Add Content Block */}
          <div className="flex items-center gap-2">
            <Select onValueChange={(type) => onAddBlock(type)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="+ Add Content Block" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Blocks */}
          <div className="space-y-2">
            {section.blocks.map((block) => (
              <ContentBlockItem
                key={block.id}
                block={block}
                onRemove={() => onRemoveBlock(block.id)}
                onUpdate={(field, value) => onUpdateBlock(block.id, field, value)}
                onSelect={() => onSelectBlock(block.id)}
                isSelected={selectedBlock === block.id}
                onAddChild={(type) => onAddBlock(type, block.id)}
                onRemoveChild={onRemoveBlock}
                onUpdateChild={onUpdateBlock}
                onSelectChild={onSelectBlock}
                selectedBlock={selectedBlock}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ContentBlockItem({
  block,
  onRemove,
  onUpdate,
  onSelect,
  isSelected,
  onAddChild,
  onRemoveChild,
  onUpdateChild,
  onSelectChild,
  selectedBlock,
  level = 0,
}: {
  block: ContentBlock
  onRemove: () => void
  onUpdate: (field: string, value: any) => void
  onSelect: () => void
  isSelected: boolean
  onAddChild?: (type: string) => void
  onRemoveChild?: (blockId: string) => void
  onUpdateChild?: (blockId: string, field: string, value: any) => void
  onSelectChild?: (blockId: string) => void
  selectedBlock?: string
  level?: number
}) {
  const contentType = contentTypes.find((t) => t.type === block.type)

  return (
    <div className={`${level > 0 ? "ml-4 border-l-2 border-gray-200 pl-2" : ""}`}>
      <div
        className={`p-2 border rounded cursor-pointer transition-colors ${
          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={onSelect}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{contentType?.icon}</span>
            <span className="text-sm font-medium">{contentType?.label}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Content Preview */}
        <div className="mt-2 text-xs text-gray-600">
          {block.type === "text" && <span>{block.content.text?.substring(0, 50)}...</span>}
          {block.type === "heading" && (
            <span>
              {block.content.level}: {block.content.text?.substring(0, 30)}...
            </span>
          )}
          {block.type === "image" && <span>Image: {block.content.alt || "No alt text"}</span>}
          {block.type === "table" && <span>Table: {block.content.rows?.length || 0} rows</span>}
          {block.type === "grid" && <span>Grid: {block.children?.length || 0} items</span>}
        </div>
      </div>

      {/* Grid Children */}
      {block.type === "grid" && block.children && (
        <div className="mt-2 space-y-2">
          {onAddChild && (
            <div className="ml-4">
              <Select onValueChange={onAddChild}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="+ Add to Grid" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes
                    .filter((t) => t.type !== "grid" || level < 2)
                    .map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {block.children.map((child) => (
            <ContentBlockItem
              key={child.id}
              block={child}
              onRemove={() => onRemoveChild?.(child.id)}
              onUpdate={(field, value) => onUpdateChild?.(child.id, field, value)}
              onSelect={() => onSelectChild?.(child.id)}
              isSelected={selectedBlock === child.id}
              onAddChild={level < 2 ? (type) => onAddChild?.(type) : undefined}
              onRemoveChild={onRemoveChild}
              onUpdateChild={onUpdateChild}
              onSelectChild={onSelectChild}
              selectedBlock={selectedBlock}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BlockSettings({
  block,
  onUpdateSettings,
}: { block: ContentBlock | null; onUpdateSettings: (settings: any) => void }) {
  if (!block) return null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Content Settings</h3>
        <ContentForm block={block} />
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-3">Style Settings</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Text Color</Label>
            <Input
              type="color"
              value={block.settings.style?.color || "#000000"}
              onChange={(e) => onUpdateSettings({ style: { ...block.settings.style, color: e.target.value } })}
              className="h-8 w-full"
            />
          </div>

          <div>
            <Label className="text-sm">Background Color</Label>
            <Input
              type="color"
              value={block.settings.style?.backgroundColor || "#ffffff"}
              onChange={(e) =>
                onUpdateSettings({ style: { ...block.settings.style, backgroundColor: e.target.value } })
              }
              className="h-8 w-full"
            />
          </div>

          <div>
            <Label className="text-sm">Font Size</Label>
            <Select
              value={block.settings.style?.fontSize || "16px"}
              onValueChange={(value) => onUpdateSettings({ style: { ...block.settings.style, fontSize: value } })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12px">12px</SelectItem>
                <SelectItem value="14px">14px</SelectItem>
                <SelectItem value="16px">16px</SelectItem>
                <SelectItem value="18px">18px</SelectItem>
                <SelectItem value="20px">20px</SelectItem>
                <SelectItem value="24px">24px</SelectItem>
                <SelectItem value="32px">32px</SelectItem>
                <SelectItem value="48px">48px</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Text Align</Label>
            <Select
              value={block.settings.style?.textAlign || "left"}
              onValueChange={(value) => onUpdateSettings({ style: { ...block.settings.style, textAlign: value } })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Margin Bottom</Label>
            <Slider
              value={[Number.parseInt(block.settings.style?.marginBottom?.replace("px", "") || "0")]}
              onValueChange={([value]) =>
                onUpdateSettings({ style: { ...block.settings.style, marginBottom: `${value}px` } })
              }
              max={100}
              step={4}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Update the ContentForm function for grid settings
function ContentForm({ block }: { block: ContentBlock }) {
  const [content, setContent] = useState(block.content)

  const updateContent = (field: string, value: any) => {
    setContent({ ...content, [field]: value })
    // In a real app, you'd debounce this or use a different update mechanism
  }

  switch (block.type) {
    case "text":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-sm">Text Content</Label>
            <Textarea
              value={content.text || ""}
              onChange={(e) => updateContent("text", e.target.value)}
              placeholder="Enter your text content"
              rows={4}
            />
          </div>
        </div>
      )

    case "heading":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-sm">Heading Level</Label>
            <Select value={content.level || "h1"} onValueChange={(value) => updateContent("level", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {headingLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Heading Text</Label>
            <Input
              value={content.text || ""}
              onChange={(e) => updateContent("text", e.target.value)}
              placeholder="Enter heading text"
            />
          </div>
        </div>
      )

    case "image":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-sm">Image URL</Label>
            <Input
              value={content.src || ""}
              onChange={(e) => updateContent("src", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label className="text-sm">Alt Text</Label>
            <Input
              value={content.alt || ""}
              onChange={(e) => updateContent("alt", e.target.value)}
              placeholder="Describe the image"
            />
          </div>
          <div>
            <Label className="text-sm">Width</Label>
            <Input
              value={content.width || ""}
              onChange={(e) => updateContent("width", e.target.value)}
              placeholder="auto, 100px, 50%, etc."
            />
          </div>
        </div>
      )

    case "table":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-sm">Table Data (CSV format)</Label>
            <Textarea
              value={
                content.csvData ||
                "Header 1,Header 2,Header 3\nRow 1 Col 1,Row 1 Col 2,Row 1 Col 3\nRow 2 Col 1,Row 2 Col 2,Row 2 Col 3"
              }
              onChange={(e) => updateContent("csvData", e.target.value)}
              placeholder="Header 1,Header 2,Header 3&#10;Row 1 Col 1,Row 1 Col 2,Row 1 Col 3"
              rows={6}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={content.hasHeader || true}
              onCheckedChange={(checked) => updateContent("hasHeader", checked)}
            />
            <Label className="text-sm">First row is header</Label>
          </div>
        </div>
      )

    case "grid":
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Desktop Columns</Label>
            <Select value={content.columns || "2"} onValueChange={(value) => updateContent("columns", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
                <SelectItem value="5">5 Columns</SelectItem>
                <SelectItem value="6">6 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Tablet Columns</Label>
            <Select
              value={content.tabletColumns || "2"}
              onValueChange={(value) => updateContent("tabletColumns", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Mobile Columns</Label>
            <Select
              value={content.mobileColumns || "1"}
              onValueChange={(value) => updateContent("mobileColumns", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Gap Size</Label>
            <Select value={content.gap || "16"} onValueChange={(value) => updateContent("gap", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No Gap (0px)</SelectItem>
                <SelectItem value="8">Small (8px)</SelectItem>
                <SelectItem value="16">Medium (16px)</SelectItem>
                <SelectItem value="24">Large (24px)</SelectItem>
                <SelectItem value="32">Extra Large (32px)</SelectItem>
                <SelectItem value="48">Huge (48px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Grid Alignment</Label>
            <Select value={content.alignment || "start"} onValueChange={(value) => updateContent("alignment", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Vertical Alignment</Label>
            <Select
              value={content.verticalAlignment || "start"}
              onValueChange={(value) => updateContent("verticalAlignment", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Top</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">Bottom</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={content.autoFit || false}
              onCheckedChange={(checked) => updateContent("autoFit", checked)}
            />
            <Label className="text-sm">Auto-fit columns</Label>
          </div>

          {content.autoFit && (
            <div>
              <Label className="text-sm">Minimum Column Width</Label>
              <Input
                value={content.minColumnWidth || "200px"}
                onChange={(e) => updateContent("minColumnWidth", e.target.value)}
                placeholder="200px, 15rem, etc."
              />
            </div>
          )}
        </div>
      )

    default:
      return <div>No settings available for this content type.</div>
  }
}

function LandingPagePreview({ sections }: { sections: FormSection[] }) {
  return (
    <div className="space-y-0">
      {sections.map((section) => (
        <div
          key={section.id}
          style={{
            backgroundColor: section.settings.backgroundColor,
            padding: `${section.settings.padding}px`,
            margin: `${section.settings.margin}px 0`,
          }}
          className={section.settings.fullWidth ? "w-full" : "max-w-6xl mx-auto"}
        >
          {section.blocks.map((block) => (
            <ContentBlockPreview key={block.id} block={block} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Update the ContentBlockPreview function to handle dynamic grids properly
function ContentBlockPreview({ block }: { block: ContentBlock }) {
  const style = block.settings.style || {}

  switch (block.type) {
    case "text":
      return <p style={style}>{block.content.text || "Enter your text content here"}</p>

    case "heading":
      const HeadingTag = block.content.level || "h1"
      return <HeadingTag style={style}>{block.content.text || "Enter heading text"}</HeadingTag>

    case "image":
      return (
        <img
          src={block.content.src || "/placeholder.svg?height=200&width=400"}
          alt={block.content.alt || "Image"}
          style={{
            ...style,
            width: block.content.width || "auto",
            maxWidth: "100%",
            height: "auto",
          }}
        />
      )

    case "table":
      const csvData = block.content.csvData || "Header 1,Header 2,Header 3\nRow 1 Col 1,Row 1 Col 2,Row 1 Col 3"
      const rows = csvData.split("\n").map((row) => row.split(","))
      const hasHeader = block.content.hasHeader !== false

      return (
        <div style={style} className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            {hasHeader && rows.length > 0 && (
              <thead>
                <tr>
                  {rows[0].map((cell, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.slice(hasHeader ? 1 : 0).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case "grid":
      const columns = Number.parseInt(block.content.columns || "2")
      const tabletColumns = Number.parseInt(block.content.tabletColumns || "2")
      const mobileColumns = Number.parseInt(block.content.mobileColumns || "1")
      const gap = Number.parseInt(block.content.gap || "16")
      const alignment = block.content.alignment || "start"
      const verticalAlignment = block.content.verticalAlignment || "start"
      const autoFit = block.content.autoFit || false
      const minColumnWidth = block.content.minColumnWidth || "200px"

      const gridStyle = {
        ...style,
        display: "grid",
        gap: `${gap}px`,
        alignItems: verticalAlignment,
        justifyItems: alignment,
        ...(autoFit
          ? {
              gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`,
            }
          : {
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }),
      }

      // Add responsive styles using CSS-in-JS approach
      const responsiveStyle = `
        @media (max-width: 768px) {
          .grid-${block.id} {
            grid-template-columns: repeat(${mobileColumns}, 1fr) !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .grid-${block.id} {
            grid-template-columns: repeat(${tabletColumns}, 1fr) !important;
          }
        }
      `

      return (
        <>
          <style dangerouslySetInnerHTML={{ __html: responsiveStyle }} />
          <div style={gridStyle} className={`grid-${block.id}`}>
            {block.children && block.children.length > 0 ? (
              block.children.map((child) => (
                <div key={child.id} className="grid-item">
                  <ContentBlockPreview block={child} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded">
                <p>Empty Grid - Add content blocks to see them here</p>
                <p className="text-sm mt-2">
                  {autoFit
                    ? `Auto-fit columns (min: ${minColumnWidth})`
                    : `${columns} columns on desktop, ${tabletColumns} on tablet, ${mobileColumns} on mobile`}
                </p>
              </div>
            )}
          </div>
        </>
      )

    default:
      return <div>Unknown content type: {block.type}</div>
  }
}

// Update the getDefaultContent function for grid
function getDefaultContent(type: string) {
  switch (type) {
    case "text":
      return { text: "Enter your text content here" }
    case "heading":
      return { text: "New Heading", level: "h2" }
    case "image":
      return { src: "/placeholder.svg?height=200&width=400", alt: "Image description", width: "auto" }
    case "table":
      return {
        csvData: "Header 1,Header 2,Header 3\nRow 1 Col 1,Row 1 Col 2,Row 1 Col 3\nRow 2 Col 1,Row 2 Col 2,Row 2 Col 3",
        hasHeader: true,
      }
    case "grid":
      return {
        columns: "3",
        tabletColumns: "2",
        mobileColumns: "1",
        gap: "16",
        alignment: "start",
        verticalAlignment: "start",
        autoFit: false,
        minColumnWidth: "200px",
      }
    default:
      return {}
  }
}

function getDefaultSettings(type: string) {
  switch (type) {
    case "text":
      return { style: { fontSize: "16px", lineHeight: "1.6", marginBottom: "16px" } }
    case "heading":
      return { style: { fontWeight: "bold", marginBottom: "16px" } }
    case "image":
      return { style: { marginBottom: "16px" } }
    case "table":
      return { style: { marginBottom: "16px" } }
    case "grid":
      return { style: { marginBottom: "16px" } }
    default:
      return { style: {} }
  }
}

function findBlockById(sections: FormSection[], blockId: string): ContentBlock | null {
  for (const section of sections) {
    const block = findBlockInList(section.blocks, blockId)
    if (block) return block
  }
  return null
}

function findBlockInList(blocks: ContentBlock[], blockId: string): ContentBlock | null {
  for (const block of blocks) {
    if (block.id === blockId) return block
    if (block.children) {
      const found = findBlockInList(block.children, blockId)
      if (found) return found
    }
  }
  return null
}

function findSectionIdByBlockId(sections: FormSection[], blockId: string): string | null {
  for (const section of sections) {
    if (findBlockInList(section.blocks, blockId)) {
      return section.id
    }
  }
  return null
}
