import { databases, storage } from './appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'agent_kyc';
const STORAGE_BUCKET_ID = 'documents';

export interface KycDocument {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    user_id: string;
    document_type: string;
    document_number: string | null;
    document_file_id: string | null;
    status: 'pending' | 'verified' | 'rejected';
    submitted_at: string;
    verified_at: string | null;
    verified_by: string | null;
    rejection_reason: string | null;
    expiry_date: string | null;
    notes: string | null;
    is_primary: boolean;
}

export type KycDocumentType = 
    | 'national_id'
    | 'passport'
    | 'drivers_license'
    | 'agent_license'
    | 'broker_license'
    | 'business_registration'
    | 'tax_certificate'
    | 'proof_of_address'
    | 'professional_certification'
    | 'agency_registration'
    | 'rera_certificate'
    | 'other';

export const KYC_DOCUMENT_TYPES: { value: KycDocumentType; label: string; description: string; forAgency: boolean }[] = [
    { value: 'national_id', label: 'National ID Card', description: 'Government-issued national identification card', forAgency: false },
    { value: 'passport', label: 'Passport', description: 'Valid international passport', forAgency: false },
    { value: 'drivers_license', label: "Driver's License", description: 'Valid driving license', forAgency: false },
    { value: 'agent_license', label: 'Real Estate Agent License', description: 'Licensed real estate agent certification', forAgency: false },
    { value: 'broker_license', label: 'Broker License', description: 'Real estate broker license', forAgency: false },
    { value: 'business_registration', label: 'Business Registration', description: 'Company registration certificate', forAgency: true },
    { value: 'tax_certificate', label: 'Tax Registration Certificate', description: 'Tax identification or registration', forAgency: true },
    { value: 'proof_of_address', label: 'Proof of Address', description: 'Utility bill or bank statement (within 3 months)', forAgency: false },
    { value: 'professional_certification', label: 'Professional Certification', description: 'Industry certifications or qualifications', forAgency: false },
    { value: 'agency_registration', label: 'Agency Registration', description: 'Real estate agency registration certificate', forAgency: true },
    { value: 'rera_certificate', label: 'RERA Certificate', description: 'Real Estate Regulatory Authority certificate', forAgency: true },
    { value: 'other', label: 'Other Document', description: 'Any other supporting document', forAgency: false },
];

export interface CreateKycDocumentData {
    user_id: string;
    document_type: KycDocumentType;
    document_number?: string;
    document_file_id?: string;
    expiry_date?: string;
    notes?: string;
    is_primary?: boolean;
}

export interface UpdateKycDocumentData {
    document_number?: string;
    document_file_id?: string;
    status?: 'pending' | 'verified' | 'rejected';
    verified_at?: string;
    verified_by?: string;
    rejection_reason?: string;
    expiry_date?: string;
    notes?: string;
    is_primary?: boolean;
}

// Overall KYC status for a user
export type KycOverallStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected' | 'suspended';

export interface KycStatusSummary {
    overallStatus: KycOverallStatus;
    total: number;
    pending: number;
    verified: number;
    rejected: number;
    isFullyVerified: boolean;
    requiredDocuments: KycDocumentType[];
    missingDocuments: KycDocumentType[];
    hasRejectedDocuments: boolean;
    hasPendingDocuments: boolean;
}

class KycService {
    /**
     * Create a new KYC document submission
     */
    async createDocument(data: CreateKycDocumentData): Promise<KycDocument> {
        const document = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                ...data,
                status: 'pending',
                submitted_at: new Date().toISOString(),
            }
        );
        return document as unknown as KycDocument;
    }

    /**
     * Get all KYC documents for a user
     */
    async getDocumentsByUser(userId: string): Promise<KycDocument[]> {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('user_id', userId),
                Query.orderDesc('$createdAt'),
            ]
        );
        return response.documents as unknown as KycDocument[];
    }

    /**
     * Get a single KYC document by ID
     */
    async getDocument(documentId: string): Promise<KycDocument> {
        const document = await databases.getDocument(
            DATABASE_ID,
            COLLECTION_ID,
            documentId
        );
        return document as unknown as KycDocument;
    }

    /**
     * Update a KYC document
     */
    async updateDocument(documentId: string, data: UpdateKycDocumentData): Promise<KycDocument> {
        const document = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            documentId,
            data
        );
        return document as unknown as KycDocument;
    }

    /**
     * Delete a KYC document
     */
    async deleteDocument(documentId: string): Promise<void> {
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_ID,
            documentId
        );
    }

    /**
     * Upload a document file to storage
     */
    async uploadFile(file: File): Promise<string> {
        const result = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            file
        );
        return result.$id;
    }

    /**
     * Delete a document file from storage
     */
    async deleteFile(fileId: string): Promise<void> {
        await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
    }

    /**
     * Get file preview/download URL
     */
    getFilePreviewUrl(fileId: string): string {
        return storage.getFilePreview(STORAGE_BUCKET_ID, fileId);
    }

    /**
     * Get file download URL
     */
    getFileDownloadUrl(fileId: string): string {
        return storage.getFileDownload(STORAGE_BUCKET_ID, fileId);
    }

    /**
     * Get KYC verification status summary for a user
     */
    async getVerificationStatus(userId: string): Promise<KycStatusSummary> {
        const documents = await this.getDocumentsByUser(userId);
        
        const pending = documents.filter(d => d.status === 'pending').length;
        const verified = documents.filter(d => d.status === 'verified').length;
        const rejected = documents.filter(d => d.status === 'rejected').length;

        // Required documents for full verification
        const requiredDocuments: KycDocumentType[] = ['national_id', 'agent_license', 'proof_of_address'];
        const submittedTypes = documents.map(d => d.document_type as KycDocumentType);
        const verifiedTypes = documents.filter(d => d.status === 'verified').map(d => d.document_type as KycDocumentType);
        
        const missingDocuments = requiredDocuments.filter(req => !submittedTypes.includes(req));
        const isFullyVerified = requiredDocuments.every(req => verifiedTypes.includes(req));
        const hasRejectedDocuments = rejected > 0;
        const hasPendingDocuments = pending > 0;

        // Determine overall status
        let overallStatus: KycOverallStatus;
        if (documents.length === 0) {
            overallStatus = 'not_submitted';
        } else if (isFullyVerified) {
            overallStatus = 'verified';
        } else if (hasRejectedDocuments && !hasPendingDocuments && verified === 0) {
            overallStatus = 'rejected';
        } else if (hasPendingDocuments) {
            overallStatus = 'pending';
        } else if (hasRejectedDocuments) {
            overallStatus = 'rejected';
        } else {
            overallStatus = 'pending'; // Some docs submitted but not all required
        }

        return {
            overallStatus,
            total: documents.length,
            pending,
            verified,
            rejected,
            isFullyVerified,
            requiredDocuments,
            missingDocuments,
            hasRejectedDocuments,
            hasPendingDocuments,
        };
    }

    /**
     * Get all pending KYC documents (admin use)
     */
    async getPendingDocuments(limit: number = 25, offset: number = 0): Promise<{ documents: KycDocument[]; total: number }> {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('status', 'pending'),
                Query.orderAsc('submitted_at'),
                Query.limit(limit),
                Query.offset(offset),
            ]
        );
        return {
            documents: response.documents as unknown as KycDocument[],
            total: response.total,
        };
    }

    /**
     * Verify a KYC document (admin use)
     */
    async verifyDocument(documentId: string, verifiedBy: string): Promise<KycDocument> {
        return this.updateDocument(documentId, {
            status: 'verified',
            verified_at: new Date().toISOString(),
            verified_by: verifiedBy,
            rejection_reason: undefined,
        });
    }

    /**
     * Reject a KYC document (admin use)
     */
    async rejectDocument(documentId: string, verifiedBy: string, reason: string): Promise<KycDocument> {
        return this.updateDocument(documentId, {
            status: 'rejected',
            verified_at: new Date().toISOString(),
            verified_by: verifiedBy,
            rejection_reason: reason,
        });
    }
}

export const kycService = new KycService();
