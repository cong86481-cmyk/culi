'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  accept?: string
  maxSize?: number // MB
}

export function ImageUploader({
  value,
  onChange,
  label,
  placeholder = 'Nhấn để tải ảnh lên',
  accept = 'image/*',
  maxSize = 5,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setError('')
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Kích thước file không được vượt quá ${maxSize}MB`)
      return
    }

    setIsUploading(true)

    try {
      // Convert to base64
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        onChange(base64)
        setIsUploading(false)
      }

      reader.onerror = () => {
        setError('Lỗi khi đọc file')
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (err) {
      setError('Lỗi khi xử lý ảnh')
      setIsUploading(false)
    }
  }, [maxSize, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-[#2D2D3A]">
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-colors"
            >
              Thay đổi
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative h-40 rounded-xl border-2 border-dashed transition-all cursor-pointer
            flex flex-col items-center justify-center gap-3
            ${isDragging 
              ? 'border-[#FF6B00] bg-[#FF6B00]/10' 
              : 'border-[#3D3D4A] hover:border-[#FF6B00]/50 bg-[#1A1A24]/50'
            }
            ${error ? 'border-red-500' : ''}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-[#FF6B00] animate-spin" />
              <p className="text-sm text-[#A1A1AA]">Đang tải lên...</p>
            </>
          ) : (
            <>
              <div className={`
                p-3 rounded-full transition-colors
                ${isDragging ? 'bg-[#FF6B00]/20' : 'bg-[#252532]'}
              `}>
                <Upload className={`w-8 h-8 ${isDragging ? 'text-[#FF6B00]' : 'text-[#71717A]'}`} />
              </div>
              <p className="text-sm text-[#A1A1AA]">{placeholder}</p>
              <p className="text-xs text-[#71717A]">Kéo thả hoặc nhấn để chọn (tối đa {maxSize}MB)</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

// Gallery Uploader for multiple images
interface GalleryUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
  maxImages?: number
  maxSize?: number
}

export function GalleryUploader({
  value = [],
  onChange,
  label,
  maxImages = 10,
  maxSize = 5,
}: GalleryUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList) => {
    setError('')
    
    const filesArray = Array.from(files)
    const remainingSlots = maxImages - value.length
    
    if (filesArray.length > remainingSlots) {
      setError(`Chỉ có thể thêm tối đa ${remainingSlots} ảnh`)
      filesArray.splice(remainingSlots)
    }

    if (filesArray.length === 0) return

    setUploadingCount(filesArray.length)

    const newUrls: string[] = []

    for (const file of filesArray) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chỉ chọn file hình ảnh')
        continue
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Kích thước file không được vượt quá ${maxSize}MB`)
        continue
      }

      try {
        const reader = new FileReader()
        
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        newUrls.push(base64)
      } catch (err) {
        setError('Lỗi khi xử lý ảnh')
      }
    }

    setUploadingCount(0)
    
    if (newUrls.length > 0) {
      onChange([...value, ...newUrls])
    }
  }, [maxImages, maxSize, onChange, value])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleRemove = (index: number) => {
    const newUrls = [...value]
    newUrls.splice(index, 1)
    onChange(newUrls)
  }

  const canAddMore = value.length < maxImages

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Existing images */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {value.map((url, index) => (
            <div 
              key={index} 
              className="relative group aspect-square rounded-lg overflow-hidden border border-[#2D2D3A]"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#FF6B00] rounded text-[10px] text-white font-medium">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add more button */}
      {canAddMore && (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative h-24 rounded-xl border-2 border-dashed transition-all cursor-pointer
            flex items-center justify-center gap-2
            ${isDragging 
              ? 'border-[#FF6B00] bg-[#FF6B00]/10' 
              : 'border-[#3D3D4A] hover:border-[#FF6B00]/50 bg-[#1A1A24]/50'
            }
          `}
        >
          {uploadingCount > 0 ? (
            <>
              <Loader2 className="w-6 h-6 text-[#FF6B00] animate-spin" />
              <p className="text-sm text-[#A1A1AA]">Đang tải {uploadingCount} ảnh...</p>
            </>
          ) : (
            <>
              <Image className={`w-6 h-6 ${isDragging ? 'text-[#FF6B00]' : 'text-[#71717A]'}`} />
              <p className="text-sm text-[#A1A1AA]">
                Thêm ảnh ({value.length}/{maxImages})
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <p className="text-xs text-[#71717A]">
        Ảnh đầu tiên sẽ là ảnh cover. Kéo thả hoặc nhấn để thêm (tối đa {maxSize}MB/ảnh)
      </p>
    </div>
  )
}
