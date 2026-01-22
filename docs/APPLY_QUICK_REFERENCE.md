# Apply Routes - Quick Reference Guide

## 🚀 Quick Start

### Route Access
- **Selection**: `https://yourdomain.com/apply`
- **Agent Form**: `https://yourdomain.com/apply/agent`
- **Agency Form**: `https://yourdomain.com/apply/agency`
- **Completion**: `https://yourdomain.com/profile/{documentId}/complete`

### File Locations
```
d:\clients\real_landing\reallanding\
├── app\(apply)\
│   ├── layout.tsx           # Main layout
│   ├── page.tsx             # Selection page
│   ├── agent\page.tsx       # Agent form
│   └── agency\page.tsx      # Agency form
├── lib\auth-context.tsx      # Auth context
└── app\(profile)\profile\[profileId]\complete\page.tsx  # Completion
```

## 📋 Form Field Checklist

### Agent Application - 17 Required Fields
- [ ] First Name
- [ ] Last Name
- [ ] Phone Number
- [ ] License Number
- [ ] Years of Experience
- [ ] Designation/Title
- [ ] Timezone
- [ ] Preferred Contact Method
- [ ] Specializations
- [ ] Service Areas
- [ ] Languages Spoken
- [ ] Professional Bio (min 50 chars)
- [ ] City
- [ ] State
- [ ] Country
- [ ] Response Time (hours)
- [ ] Company Name (optional)

### Agency Application - 15 Required Fields
- [ ] Company Name
- [ ] Registration/License Number
- [ ] Established Year
- [ ] Team Size
- [ ] Contact Person First Name
- [ ] Contact Person Last Name
- [ ] Phone Number
- [ ] Specializations
- [ ] Property Types Handled
- [ ] Service Areas
- [ ] Languages Spoken
- [ ] Company Description (min 50 chars)
- [ ] City
- [ ] State
- [ ] Country
- [ ] Timezone
- [ ] Preferred Contact Method
- [ ] Response Time (hours)

## 🔐 Authentication Requirements

- User must be signed in with Appwrite account
- Automatic redirect to signin if not authenticated
- User ID automatically captured from session
- Email automatically populated from account

## 📊 Database Operations

### Create Profile
```typescript
const profile = await usersService.create({
  user_id: authUser.$id,
  email: authUser.email,
  first_name: formData.first_name,
  last_name: formData.last_name,
  phone: formData.phone,
  user_type: formData.userType, // 'agent' or 'agency'
});
```

### Update Profile with Application Data
```typescript
await usersService.update(profile.$id, {
  license_number: formData.license_number,
  experience_years: formData.experience_years,
  // ... all other fields
  account_status: 'pending',
  profile_completion_percentage: 40,
});
```

### Retrieve Profile
```typescript
// By document ID
const profile = await usersService.getById(profileId);

// By user ID (recommended for current user)
const profile = await usersService.getByUserId(userId);
```

## ✅ Validation Rules

### Common Validations
```
String fields (min length):
- Names: minimum 2 characters
- License: minimum 5 characters
- Bio/Description: minimum 50 characters
- Service areas: minimum 10 characters

Number fields:
- Experience years: 0+
- Team size: 1+ (for agencies)
- Established year: 1900 to current year
- Response time: 1+ hours

URL fields:
- Must be valid URLs (for optional fields)
- LinkedIn, Instagram, Facebook, Website

Phone fields:
- Alphanumeric with special chars allowed
- Format: +1 (555) 123-4567
```

## 🎨 UI Components Used

```
Button            - Submit, cancel, continue buttons
Card              - Form container, summary cards
Input             - Text fields
Textarea          - Long text fields (bio, description)
Select            - Dropdowns (timezone, contact method)
Form              - react-hook-form wrapper
FormField         - Individual field wrapper
FormLabel         - Field labels
FormControl       - Input wrapper
FormMessage       - Error messages
FormDescription   - Helper text
Spinner           - Loading indicator
```

## 📱 Responsive Design

- Mobile-first approach
- Grid layouts adjust for screen size
  - Single column on mobile (< 768px)
  - Two columns on tablet (768-1024px)
  - Adaptive on desktop (> 1024px)

## 🔄 User Journey

```
1. Visit /apply
   ↓
2. Select role (Agent/Agency)
   ↓
3. Check if user is logged in
   - If no → Redirect to signin
   - If yes → Show form
   ↓
4. Fill form with validation
   ↓
5. Click "Submit Application"
   ↓
6. Create/update user profile
   - Set account_status: "pending"
   - Set profile_completion_percentage: 40
   ↓
7. Redirect to /profile/{documentId}/complete
   ↓
8. Show confirmation and next steps
   ↓
9. User can proceed to upload documents
```

## ⚠️ Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Not authenticated" | User not logged in | Redirect to signin |
| "Validation failed" | Required field missing/invalid | Check form validation |
| "Failed to submit" | Database error | Check Appwrite console |
| "Profile not found" | Invalid profile ID | Check URL/ID passed |

## 🛠️ Development Tasks

### To Test the Form:
```bash
1. npm run dev
2. Navigate to /apply
3. Select agent or agency
4. Fill form with valid data
5. Submit
6. Check /profile/{id}/complete page
7. Verify user created in Appwrite console
```

### To Debug:
```typescript
// Check console for errors
console.error('Error:', error);

// Toast notifications show user feedback
toast.error('Failed to submit');
toast.success('Application submitted');

// Check Appwrite console for database issues
// Database: main → Collection: users
```

## 📝 Notes

- Profile starts with 40% completion after application
- Account status is "pending" until admin approval
- User can have only one profile per auth account
- Document ID is different from user ID
- All timestamps are auto-managed by Appwrite

## 🔗 Related Routes

```
/signin              - User authentication
/apply               - Apply selection
/apply/agent         - Agent form
/apply/agency        - Agency form
/profile/{id}        - User profile view
/profile/{id}/complete     - Completion page
/profile/{id}/upload-documents - Upload docs (future)
/dashboard           - User dashboard
```

## 📚 Documentation Files

- `APPLY_IMPLEMENTATION_SUMMARY.md` - High-level overview
- `APPLY_ROUTES_DOCUMENTATION.md` - Complete documentation
- `APPWRITE_USERS_SCHEMA.md` - Database schema details

## 🎯 Success Criteria

✅ Form validates correctly
✅ Profile created on submission
✅ User ID properly stored
✅ Account status set to pending
✅ Redirect to completion page works
✅ Toast notifications show
✅ Forms responsive on mobile
✅ Error messages display clearly

## 📞 Support

If something isn't working:

1. Check if user is authenticated
2. Verify Appwrite credentials in .env
3. Check browser console for JS errors
4. Check Appwrite console for database errors
5. Ensure database and collection IDs are correct
6. Check form validation logic
7. Review toast error messages

---

**Last Updated**: January 22, 2026
**Status**: ✅ Ready for Testing & Deployment
