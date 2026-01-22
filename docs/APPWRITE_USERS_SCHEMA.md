# Appwrite Users Collection Schema Analysis

## Collection Overview

**Database**: main  
**Collection ID**: users  
**Purpose**: Store user profiles for agents, agencies, and regular users

## Core Fields (Auto-Generated)

| Field | Type | Description |
|-------|------|-------------|
| `$id` | string | Auto-generated unique document ID |
| `$createdAt` | timestamp | Document creation timestamp |
| `$updatedAt` | timestamp | Document last update timestamp |
| `$permissions` | array | Document-level permissions |

## Authentication Reference

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `user_id` | string | "user123abc" | References Appwrite account ID |
| `email` | string | "user@example.com" | User's email address |

## User Type & Status

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| `user_type` | enum | "user", "agent", "agency" | Type of account |
| `account_status` | enum | "active", "inactive", "suspended", "pending", "banned" | Current status |
| `availability_status` | enum | "available", "busy", "away", "offline" | Current availability |

## Personal Information

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `first_name` | string | Yes | User's first name |
| `last_name` | string | Yes | User's last name |
| `phone` | string | Optional | Contact phone number |
| `username` | string | Yes | Unique username (derived from email) |

## Profile Management

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `profile_image_url` | string | null | User's profile photo URL |
| `banner_image_url` | string | null | User's banner image URL |
| `bio` | string | null | Professional biography |
| `description` | string | null | Additional description |
| `profile_completion_percentage` | number | 20 | Completion status (%) |
| `profile_views` | number | 0 | Count of profile views |

## Professional Credentials (Agents)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `license_number` | string | Yes (Agent) | Real estate license number |
| `designation` | string | Yes (Agent) | Job title/designation |
| `experience_years` | number | Yes (Agent) | Years of experience |
| `company_name` | string | Optional | Brokerage or company name |
| `company_id` | string | Optional | Reference to company |

## Agency Specific Fields

| Field | Type | Notes |
|-------|------|-------|
| `team_size` | number | Number of agents in agency |
| `established_year` | number | Year agency was founded |
| `registration_number` | string | Agency registration/license |
| `broker_name` | string | Primary broker name |
| `broker_license` | string | Broker license number |
| `rera_registration` | string | RERA registration (India) |
| `insurance_info` | string | Insurance details |

## Professional Information

| Field | Type | Length | Notes |
|-------|------|--------|-------|
| `specializations` | string | Long text | Property types specialized in |
| `service_areas` | string | Long text | Geographic coverage areas |
| `property_types_handled` | string | Long text | Types of properties handled |
| `languages_spoken` | string | Medium | Languages spoken |
| `certifications` | string | Long text | Professional certifications |
| `tax_id` | string | Short | Tax identification |

## Location Information

| Field | Type | Notes |
|-------|------|-------|
| `address` | string | Full address |
| `city` | string | City name |
| `state` | string | State/Province |
| `country` | string | Country name |
| `zip_code` | string | Postal code |
| `timezone` | string | User's timezone |
| `latitude` | number | Geo-latitude |
| `longitude` | number | Geo-longitude |

## Communication Preferences

| Field | Type | Options | Default |
|-------|------|---------|---------|
| `preferred_contact_method` | string | "email", "phone", "whatsapp" | "email" |
| `response_time_hours` | number | 1-168 | 24 |
| `accepts_inquiries` | boolean | - | true |
| `email_notifications_enabled` | boolean | - | true |
| `sms_notifications_enabled` | boolean | - | false |
| `push_notifications_enabled` | boolean | - | true |
| `marketing_emails_enabled` | boolean | - | false |

## Social Media & Web

| Field | Type | Notes |
|-------|------|-------|
| `website_url` | string | Personal/company website |
| `social_media_facebook` | string | Facebook profile URL |
| `social_media_instagram` | string | Instagram handle/URL |
| `social_media_twitter` | string | Twitter handle/URL |
| `social_media_youtube` | string | YouTube channel URL |
| `social_media_linkedin` | string | LinkedIn profile URL |
| `alternative_email` | string | Secondary email |
| `alternative_phone` | string | Secondary phone |
| `whatsapp_number` | string | WhatsApp number |

## Performance Metrics

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `profile_views` | number | 0 | Profile page views |
| `total_listings` | number | 0 | Total properties listed |
| `active_listings` | number | 0 | Currently active listings |
| `total_sales` | number | 0 | Total completed sales |
| `total_reviews` | number | 0 | Number of reviews received |
| `rating` | number | 0 | Average rating (0-5) |
| `response_rate_percentage` | number | 0 | % of inquiries responded to |
| `deals_closed` | number | 0 | Completed transactions |

## Inquiry Management

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `total_inquiries_received` | number | 0 | Inquiries received |
| `total_inquiries_sent` | number | 0 | Inquiries sent to others |

## Financial

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `total_earnings` | number | 0 | Cumulative earnings |
| `pending_commissions` | number | 0 | Pending commission amount |
| `credits_balance` | number | 0 | Platform credits balance |
| `commission_rate` | number | null | Commission percentage |
| `min_property_price` | number | null | Minimum property price handled |
| `max_property_price` | number | null | Maximum property price handled |

## Verification Status

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `is_active` | boolean | true | Account is active |
| `is_verified` | boolean | false | User profile verified |
| `is_premium` | boolean | false | Premium membership |
| `is_featured` | boolean | false | Featured on platform |
| `identity_verified` | boolean | false | ID verification completed |
| `documents_verified` | boolean | false | Documents verified |
| `background_check_completed` | boolean | false | Background check done |
| `bank_account_verified` | boolean | false | Bank account verified |
| `payment_method_verified` | boolean | false | Payment method verified |

## Subscription & Pricing

| Field | Type | Notes |
|-------|------|-------|
| `subscription_plan` | string | Current subscription tier |
| `language_preference` | string | Preferred interface language |
| `currency_preference` | string | Preferred currency |
| `tagline` | string | Professional tagline |
| `awards` | string | Awards and achievements |

## Application Form Field Mapping

### Agent Application Form → Users Fields
```
Personal Information:
  - first_name → first_name
  - last_name → last_name
  - phone → phone
  - timezone → timezone

Professional Information:
  - license_number → license_number
  - experience_years → experience_years
  - designation → designation
  - company_name → company_name
  - response_time_hours → response_time_hours

Expertise:
  - specializations → specializations
  - service_areas → service_areas
  - languages_spoken → languages_spoken
  - certifications → certifications

About:
  - bio → bio

Location:
  - city → city
  - state → state
  - country → country

Contact:
  - preferred_contact_method → preferred_contact_method

Social:
  - website_url → website_url
  - social_media_linkedin → social_media_linkedin
  - social_media_instagram → social_media_instagram
  - social_media_facebook → social_media_facebook
```

### Agency Application Form → Users Fields
```
Company Information:
  - company_name → company_name
  - registration_number → registration_number
  - team_size → team_size
  - established_year → established_year
  - response_time_hours → response_time_hours

Contact Person:
  - first_name → first_name
  - last_name → last_name
  - phone → phone

Professional:
  - specializations → specializations
  - property_types_handled → property_types_handled
  - service_areas → service_areas
  - languages_spoken → languages_spoken

About:
  - bio → bio

Location:
  - city → city
  - state → state
  - country → country
  - timezone → timezone

Contact:
  - preferred_contact_method → preferred_contact_method

Regulatory:
  - broker_name → broker_name
  - broker_license → broker_license
  - rera_registration → rera_registration

Social:
  - website_url → website_url
  - social_media_linkedin → social_media_linkedin
  - social_media_instagram → social_media_instagram
  - social_media_facebook → social_media_facebook
```

## Default Values for New Users

```typescript
{
  user_id: authUser.$id,
  email: authUser.email,
  is_active: true,
  is_premium: false,
  is_verified: false,
  is_featured: false,
  accepts_inquiries: true,
  availability_status: "available",
  account_status: "pending",  // Set pending for new applications
  profile_completion_percentage: 20,  // Initial: 20%, After form: 40%
  profile_views: 0,
  total_listings: 0,
  active_listings: 0,
  total_sales: 0,
  total_reviews: 0,
  rating: 0,
  experience_years: 0,
  team_size: 0,
  response_time_hours: 24,
  response_rate_percentage: 0,
  deals_closed: 0,
  total_inquiries_received: 0,
  total_inquiries_sent: 0,
  total_earnings: 0,
  pending_commissions: 0,
  credits_balance: 0,
  email_notifications_enabled: true,
  sms_notifications_enabled: false,
  push_notifications_enabled: true,
  marketing_emails_enabled: false,
  identity_verified: false,
  documents_verified: false,
  background_check_completed: false,
  bank_account_verified: false,
  payment_method_verified: false,
}
```

## Permissions Configuration

### Required for Agents/Agencies to Create Profile
```
read("any")              // Allow public read
create("users")          // Allow authenticated users to create
read("users")            // Allow users to read their own
update("users")          // Allow users to update their own
```

## Indexing Recommendations

For optimal query performance, consider indexing:

```
- user_id (Exact match queries)
- email (Exact match queries)
- username (Full-text search)
- user_type (Filter queries)
- account_status (Filter queries)
- is_active (Filter queries)
- is_featured (Filter queries)
- city, state, country (Geographic filtering)
- rating (Sorting)
- created_at (Sorting)
```

## Related Collections

- **Properties** - References user via `agent_id` or `owner_id`
- **Inquiries** - References user via `inquirer_id` and `recipient_id`
- **Teams** - Agents can belong to agency teams
- **Reviews** - User reviews stored separately

## Migration Notes

When migrating existing users or importing data:
1. Ensure `user_id` matches Appwrite account IDs
2. Validate email matches auth email
3. Set appropriate `account_status`
4. Calculate `profile_completion_percentage`
5. Set initial profile views to 0
6. Migrate social media fields if available

---

**Last Updated**: January 22, 2026
**Schema Version**: 1.0
**Appwrite Version**: Latest (as of project creation)
