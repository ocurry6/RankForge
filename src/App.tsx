import { useState } from 'react'
import './App.css'

function App() {
  const [tiers, setTiers] = useState([
    'S',
    'A',
    'B',
    'C',
    'D',
    'F',
  ])

  const [boardTitle, setBoardTitle] = useState('RankForge')

  const [images, setImages] = useState<string[]>([])

  const [imageTiers, setImageTiers] = 
    useState<Record<string, string | null>>({})
 

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])

    const newImagesUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file),
    )

    const newImageTiers = Object.fromEntries(
      newImagesUrls.map((imageUrl) => [imageUrl, null]),
    )

    setImages((currentImages) => [...currentImages, ...newImagesUrls])
    setImageTiers((currentImageTiers) => ({
      ...currentImageTiers,
      ...newImageTiers,
    }))
  }
  function handleDrop(
    event : React.DragEvent<HTMLElement>,
    tier: string | null
  ) {
    event.preventDefault()

    const imageUrl = event.dataTransfer.getData('imageUrl')

    setImageTiers((currentImageTiers) => ({
      ...currentImageTiers,
      [imageUrl]: tier,
    }))
  }
  function handleDelete(imageUrl: string) {
    URL.revokeObjectURL(imageUrl)

    setImages((currentImages) =>
      currentImages.filter((image) => image !== imageUrl),
    )

    setImageTiers((currentImageTiers) => {
      const updatedImageTiers = { ...currentImageTiers }

      delete updatedImageTiers[imageUrl]

      return updatedImageTiers
    })
  }
  function handleTierNameChange(
    tierIndex: number,
    newName: string
  ) {
    const oldName = tiers[tierIndex]

    setTiers((currentTiers) => {
      const updatedTiers = [...currentTiers]
      updatedTiers[tierIndex] = newName
      return updatedTiers
    })
    setImageTiers((currentImageTiers) => 
      Object.fromEntries(
        Object.entries(currentImageTiers).map(
          ([imageUrl, assignedTier]) => [
            imageUrl,
            assignedTier === oldName ? newName : assignedTier,
          ],
        ),
      )
    )
  }
  function handleReset() {
    setImages((currentImages) => {
      currentImages.forEach((imageUrl: string) => URL.revokeObjectURL(imageUrl))
      return []
    })

    setImageTiers({})
    setBoardTitle('RankForge')
    setTiers(['S', 'A', 'B', 'C', 'D', 'F'])
  }
  return (
    <main>
      <input
        className = "title-input"
        value = {boardTitle}
        onChange = {(event) => setBoardTitle(event.target.value)}
        aria-label = "Tier list title"
      />
      <p>Create and rank your own tier list.</p>

      <div className = "controls">
        <label htmlFor = "image-upload" className="upload-button">
          Add image
        </label>

        <button
          type = "button"
          className = "reset-button"
          onClick = {handleReset}
        >
          Reset Board
        </button>

        <button
          type = "button"
          className = "save-button"
          onClick = {() => window.print()}
        >
          Save / Print
        </button>

        <input
          id = "image-upload"
          type = "file"
          accept = "image/*"
          multiple
          onChange = {handleImageUpload}
        />     
      </div>
      <div
        className = "item-bank"
        onDragOver = {(event) => event.preventDefault()}
        onDrop = {(event) => handleDrop(event, null)}
      >
        <h2>Item Bank</h2>
        {images
          .filter((image) => imageTiers[image] === null)
          .map((image, index) => (
            <div key = {image} className="image-card">
              <img
                src = {image}
                alt = {`Ranked item ${index + 1}`}
                className = "uploaded-image"
                draggable
                onDragStart = {(event) => {
                  event.dataTransfer.setData('imageUrl', image)
                }}
              />
              <button
                type = "button"
                className = "delete-button"
                onClick = {() => handleDelete(image)}
                aria-label ={`Delete image ${index + 1}`}
              >
                ×
              </button>
            </div>
          ))}
      </div>

      <div className = "image-preview"></div>

      <div className = "tier-board">
        {tiers.map((tier, tierIndex) => (
          <section
            className ="tier-row"
            key = {tierIndex}
            onDragOver = {(event) => event.preventDefault()}
            onDrop = {(event) => handleDrop(event, tier)}
          >
            <input
              className = "tier-label tier-name-input"
              value = {tier}
              onChange = {(event) =>
                handleTierNameChange(tierIndex, event.target.value)
              }
            />
            <div className="tier-content">
              {images
                .filter((image) => imageTiers[image] === tier)
                .map((image, index) => (
                  <div key = {image} className="image-card">
                    <img
                      src = {image}
                      alt = {`Ranked item ${index + 1}`}
                      className = "uploaded-image"
                      draggable
                      onDragStart = {(event) => {
                        event.dataTransfer.setData('imageUrl', image)
                      }}
                    />
                    <button
                      type = "button"
                      className = "delete-button"
                      onClick = {() => handleDelete(image)}
                      aria-label = {`Delete image ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

export default App 
    