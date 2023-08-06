// pages/testPage.tsx
import React, { useEffect, useState } from "react"
import { encryptData, decryptData } from "../utils/encryption" // Assuming the path to the encryption utility is correct

const TestPage: React.FC = () => {
  const [encryptedData, setEncryptedData] = useState("")
  const [decryptedData, setDecryptedData] = useState("")

  useEffect(() => {
    const data = "This is the data that I want to encrypt."
    const encrypted = encryptData(data)
    const decrypted = decryptData(encrypted)
    setEncryptedData(encrypted)
    setDecryptedData(decrypted)
  }, [])

  return (
    <div>
      <h1>Encryption and Decryption Test</h1>
      <p>Data: This is the data that I want to encrypt.</p>
      <p>Encrypted Data: {encryptedData}</p>
      <p>Decrypted Data: {decryptedData}</p>
    </div>
  )
}

export default TestPage
