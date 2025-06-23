# FastFill AI - API Documentation

## Gemini AI Integration

### Overview
FastFill AI menggunakan Google Gemini Pro API untuk menghasilkan data form yang intelligent dan kontekstual.

### API Endpoint
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### Authentication
- Memerlukan API Key dari Google AI Studio
- API Key disimpan secara aman di Chrome Storage
- Tidak ada server-side authentication

### Request Structure

#### Basic Request
```javascript
{
  "contents": [{
    "parts": [{
      "text": "[PROMPT]"
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 2048
  }
}
```

#### Form Data Prompt Example
```javascript
const prompt = `You are an expert form-filling assistant. Generate realistic data for this form:

FORM FIELDS:
1. Full Name (text) - Required
2. Email Address (email) - Required  
3. Phone Number (tel)
4. Company (text)
5. Message (textarea)

Return ONLY a JSON array: ["John Doe", "john@email.com", "555-123-4567", "Tech Corp", "Sample message"]`;
```

### Response Processing

#### Success Response
```javascript
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": '["John Doe", "john.doe@email.com", "555-123-4567", "Tech Solutions", "This is a sample message for testing purposes."]'
      }]
    }
  }]
}
```

#### Error Response
```javascript
{
  "error": {
    "code": 400,
    "message": "API key not valid",
    "status": "INVALID_ARGUMENT"
  }
}
```

### Field Detection Schema

#### Field Metadata Structure
```javascript
{
  index: 0,
  type: "text",
  name: "fullName",
  id: "full-name",
  label: "Full Name",
  placeholder: "Enter your name",
  required: true,
  maxLength: 100,
  options: [], // for select/radio
  context: "Contact form"
}
```

#### Supported Field Types
- `text` - Text input
- `email` - Email input
- `tel` - Phone number
- `number` - Numeric input
- `date` - Date picker
- `textarea` - Multi-line text
- `select` - Dropdown selection
- `checkbox` - Boolean checkbox
- `radio` - Radio button group
- `url` - URL input
- `password` - Password field

### AI Prompt Engineering

#### Prompt Structure
1. **Context Setting**: Menjelaskan peran AI sebagai form-filling assistant
2. **Field Description**: Detail setiap field dengan tipe dan konteks
3. **Output Format**: Spesifikasi format response yang diinginkan
4. **Examples**: Contoh output yang diharapkan

#### Best Practices
- Gunakan konteks halaman (title, headings)
- Sertakan constraints (maxLength, pattern)
- Jelaskan relasi antar field (first name + last name)
- Minta konsistensi data (email sesuai nama)

### Error Handling

#### API Errors
```javascript
// Rate limiting
{
  "error": {
    "code": 429,
    "message": "Quota exceeded"
  }
}

// Invalid API key
{
  "error": {
    "code": 403,
    "message": "API key not valid"
  }
}

// Network errors
{
  "error": {
    "code": 500,
    "message": "Internal server error"
  }
}
```

#### Fallback Strategy
1. **Retry Logic**: 3x retry dengan exponential backoff
2. **Template Fallback**: Gunakan template data jika AI gagal
3. **Partial Success**: Isi field yang bisa diisi, skip yang error
4. **User Notification**: Informasi ke user tentang status

### Rate Limiting
- Gemini API: 60 requests per minute
- Implementation: Queue requests dengan delay
- Cache: Simpan hasil untuk form yang sama

### Security Considerations

#### Data Privacy
- Tidak menyimpan prompt atau response
- API key encrypted dalam Chrome Storage
- No server-side logging

#### Input Sanitization
- Validate API key format
- Sanitize form field data
- Prevent XSS dalam generated content

### Performance Optimization

#### Request Optimization
- Batch multiple fields dalam satu request
- Compress prompt untuk efficiency
- Cache common responses

#### Response Processing
- Stream parsing untuk large responses
- Async processing untuk UI responsiveness
- Error recovery mechanisms

### Development Examples

#### Basic Form Fill
```javascript
const formFiller = new GeminiFormFiller();
await formFiller.initialize();
const result = await formFiller.fillFormWithAI();
```

#### Custom Prompt
```javascript
const customPrompt = formFiller.constructPrompt({
  fields: detectedFields,
  context: "Registration form for conference"
});
```

#### Error Handling
```javascript
try {
  const result = await formFiller.callGeminiAPI(input);
} catch (error) {
  await formFiller.fallbackTemplateFilling();
}
```

### Testing API Integration

#### Unit Tests
```javascript
// Test API key validation
const isValid = await testApiKey(apiKey);

// Test prompt generation
const prompt = constructPrompt(mockFields);

// Test response parsing
const data = parseAIResponse(mockResponse);
```

#### Integration Tests
```javascript
// Test with real Gemini API
const result = await callGeminiAPI(testPrompt);

// Test fallback mechanism
const fallback = await fallbackTemplateFilling();
```

### Monitoring & Analytics

#### Success Metrics
- API call success rate
- Form fill completion rate
- User satisfaction scores
- Field detection accuracy

#### Error Tracking
- API failure reasons
- Fallback usage frequency
- Performance bottlenecks
- User-reported issues

### Future Enhancements

#### Planned Features
- Multi-modal support (images + text)
- Context learning from user corrections
- Advanced field relationship detection
- Custom prompt templates

#### API Improvements
- Streaming responses
- Batch processing
- Custom model fine-tuning
- Regional API endpoints
