# API & Services Reference

## Authentication Services (`useAuth()` hook)

### Available Methods

```typescript
// User object
user: User | null  // Contains: $id, name, email, $createdAt

// State
isAuthenticated: boolean
loading: boolean

// Password Operations
updatePassword(params: UpdatePasswordParams): Promise<void>
// Requires: password (new), oldPassword (optional)

// Account Operations
deleteAccount(): Promise<void>
// Irreversible - deletes account entirely

// Name Operations
updateName(params: UpdateNameParams): Promise<void>
// Requires: name

// Session Operations
getSessions(): Promise<Models.Session[]>
deleteSession(sessionId: string): Promise<void>
deleteAllSessions(): Promise<void>

// Auth Operations
signOut(): Promise<void>
```

### Used in Profile Page
- [x] `updateName()` - For editing full name
- [x] `updatePassword()` - For password changes
- [x] `deleteAccount()` - For account deletion
- [x] `getSessions()` - Load active sessions on mount
- [x] `deleteSession()` - Terminate individual sessions
- [x] `deleteAllSessions()` - Clear all other sessions
- [x] `signOut()` - Sign out user

## Saved Properties Service (`savedPropertiesService`)

### Collection Information
- **Database ID:** `main`
- **Collection ID:** `user_saved_properties`
- **Properties Collection ID:** `properties`

### Available Methods

```typescript
// Fetch Operations
async getByUserId(userId: string): Promise<UserSavedProperties>
async getUserSavedProperties(
  userId: string,
  options?: {
    folder_name?: string;
    is_favorite?: boolean;
    limit?: number;
    offset?: number;
  }
): Promise<{ savedProperties: UserSavedProperties[]; total: number }>

async getUserSavedPropertiesWithDetails(
  userId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ savedProperties: SavedPropertyWithDetails[]; total: number }>

// Update Operations
async update(
  savedPropertyId: string,
  data: Partial<UserSavedProperties>
): Promise<UserSavedProperties>

// Delete Operations
async delete(savedPropertyId: string): Promise<void>

// Check Operations
async isPropertySaved(userId: string, propertyId: string): Promise<boolean>
```

### Used in Saved Properties Page
- [x] `getUserSavedPropertiesWithDetails()` - Load all saved properties
- [x] `update()` - Update notes and folder for property
- [x] `update()` - Toggle favorite status
- [x] `delete()` - Remove property from saved

## Data Models

### User (from Appwrite Auth)
```typescript
{
  $id: string;
  email: string;
  name: string;
  labels: string[];  // agent, agency, user
  $createdAt: string;  // ISO 8601 format
  $updatedAt: string;
  phone?: string;
  password?: string;  // Not exposed
}
```

### Session (from Appwrite)
```typescript
{
  $id: string;
  clientName: string;  // Browser/Client name
  deviceName?: string;  // Device name (Mobile, Desktop, etc)
  clientType: string;  // browser, mobile, etc
  clientCode: string;  // Chrome, Safari, Firefox, etc
  ip: string;  // IP address
  countryName?: string;  // Country
  current: boolean;  // Is this the current session
  $createdAt: string;
  $updatedAt: string;
}
```

### UserSavedProperties
```typescript
{
  $id: string;
  user_id: string;
  property_id: string;
  notes?: string;  // User notes about property
  folder_name?: string;  // Organization folder
  is_favorite?: boolean;  // Starred
  priority?: number;
  $createdAt: string;
  $updatedAt: string;
}
```

### Properties (Referenced)
```typescript
{
  $id: string;
  title: string;
  slug: string;
  cover_image_url: string;
  price: number;
  currency: string;
  listing_type: { name: string };  // For Sale, For Rent, etc
  city: { name: string };
}
```

## Error Handling

All services include error handling:
- Console error logging
- Throw errors for UI handling
- Toast notifications display user-friendly messages
- Try-catch blocks in components

## Authentication Flow

1. User navigates to `/u/profile`
2. `useAuth()` checks if authenticated
3. If not authenticated, redirect to sign in page
4. If authenticated:
   - Load user data from auth store
   - Fetch sessions from Appwrite
   - Render profile with loaded data

## Saved Properties Flow

1. User navigates to `/u/saved`
2. Check authentication status
3. Fetch saved properties with `getUserSavedPropertiesWithDetails()`
4. Properties include:
   - Saved property metadata (notes, folder, favorite)
   - Full property details (fetched from properties collection)
5. User can:
   - Search/filter properties
   - Edit notes/folder using `update()`
   - Toggle favorites using `update()`
   - Delete using `delete()`

## Rate Limiting & Quotas

Based on Appwrite configuration:
- Default rate limits apply
- Batch operations possible with Promise.all()
- No special quotas for these operations

## Caching Strategy

- No caching implemented (real-time updates)
- Data fetched fresh on page load
- Updates immediately reflect in UI

## Real-Time Updates

Currently no real-time subscriptions implemented:
- Manual refresh required for multi-tab sync
- Consider adding WebSocket listeners in future
- Use Appwrite's real-time API if needed

## Performance Considerations

- Lazy load sessions on profile page
- Limit initial saved properties fetch
- Use pagination in saved properties (100 per page recommended)
- Images lazy-loaded from external sources
- Minimal bundle impact from UI components

## Security Notes

- Passwords never exposed in UI
- Session IDs used for deletion only
- CORS handled by Appwrite
- API keys secured in environment
- All mutations require authentication

---

## Integration Points

### With Database
- Saved properties stored in `user_saved_properties` collection
- References to `properties` collection
- User ID as foreign key

### With Properties Pages
- `/p/[slug]` - View full property
- `/properties` - Browse all properties
- Links from saved properties to full pages

### With Authentication System
- Session management
- Password security
- Account deletion cascade (expected)

---

**Last Updated:** January 22, 2026
**Status:** ✅ Ready for Production
