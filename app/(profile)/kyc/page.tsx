"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
    kycService,
    KycDocument,
    KYC_DOCUMENT_TYPES,
    type KycDocumentType,
    type KycStatusSummary,
} from "@/services/kyc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import {
    FileText,
    Upload,
    CheckCircle2,
    XCircle,
    Clock,
    Shield,
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    Download,
    Eye,
    Trash2,
    ArrowRight,
    FileWarning,
    HelpCircle,
} from "lucide-react";

// Not Submitted State - Hero CTA to start verification
function NotSubmittedState() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-8 md:p-12">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Shield className="h-4 w-4" />
                        Identity Verification Required
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Complete Your KYC Verification
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        Verify your identity to unlock all platform features, build trust with clients,
                        and start listing properties. The process takes just a few minutes.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" asChild>
                            <Link href="/kyc/upload">
                                <Upload className="h-5 w-5 mr-2" />
                                Start Verification
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/contact">
                                <HelpCircle className="h-5 w-5 mr-2" />
                                Need Help?
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center opacity-10">
                    <ShieldCheck className="h-64 w-64 text-primary" />
                </div>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="p-3 bg-green-100 rounded-full w-fit mb-4">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Build Trust</h3>
                        <p className="text-sm text-muted-foreground">
                            Verified profiles get more inquiries and are preferred by property seekers.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="p-3 bg-primary/20 rounded-full w-fit mb-4">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Unlock Features</h3>
                        <p className="text-sm text-muted-foreground">
                            Access premium features like featured listings and priority support.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="p-3 bg-purple-100 rounded-full w-fit mb-4">
                            <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Quick Process</h3>
                        <p className="text-sm text-muted-foreground">
                            Submit your documents in minutes. Most verifications are completed within 24 hours.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Required Documents */}
            <Card>
                <CardHeader>
                    <CardTitle>What You&apos;ll Need</CardTitle>
                    <CardDescription>
                        Prepare the following documents to complete your verification
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        {['national_id', 'agent_license', 'proof_of_address'].map((docValue) => {
                            const docType = KYC_DOCUMENT_TYPES.find(t => t.value === docValue);
                            if (!docType) return null;

                            return (
                                <div key={docType.value} className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
                                    <div className="p-2 rounded-full bg-muted">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">{docType.label}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">{docType.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Pending State - Documents submitted, awaiting review
function PendingState({
    documents,
    status,
    onDelete,
    getDocumentTypeLabel,
    getStatusBadge,
}: {
    documents: KycDocument[];
    status: KycStatusSummary;
    onDelete: (id: string, fileId: string | null) => void;
    getDocumentTypeLabel: (type: string) => string;
    getStatusBadge: (status: string) => React.ReactNode;
}) {
    const progress = Math.round((status.verified / status.requiredDocuments.length) * 100);
    const hasMissingDocs = status.missingDocuments.length > 0;

    return (
        <div className="space-y-6">
            {/* Status Header */}
            <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-yellow-800">Verification In Progress</h2>
                            <p className="text-yellow-700 mt-1">
                                {hasMissingDocs
                                    ? `You've submitted ${documents.length} document(s). ${status.missingDocuments.length} more required.`
                                    : "Your documents are being reviewed. We'll notify you once complete."
                                }
                            </p>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-yellow-700">Verification Progress</span>
                                    <span className="font-medium text-yellow-800">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{status.verified}</div>
                                    <div className="text-xs text-muted-foreground">Verified</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">{status.pending}</div>
                                    <div className="text-xs text-muted-foreground">Pending</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Missing Documents Alert */}
            {hasMissingDocs && (
                <Alert className="border-primary/30 bg-primary/10">
                    <Upload className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary">Additional Documents Required</AlertTitle>
                    <AlertDescription className="text-primary/80">
                        <div className="flex flex-wrap gap-2 mt-2">
                            {status.missingDocuments.map(doc => (
                                <Badge key={doc} variant="outline" className="border-primary/30 text-primary">
                                    {getDocumentTypeLabel(doc)}
                                </Badge>
                            ))}
                        </div>
                        <Button size="sm" className="mt-3" asChild>
                            <Link href="/kyc/upload">
                                Upload Missing Documents
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Documents List */}
            <DocumentsList
                documents={documents}
                onDelete={onDelete}
                getDocumentTypeLabel={getDocumentTypeLabel}
                getStatusBadge={getStatusBadge}
            />
        </div>
    );
}

// Verified State - All documents verified
function VerifiedState({
    documents,
    getDocumentTypeLabel,
    getStatusBadge,
}: {
    documents: KycDocument[];
    getDocumentTypeLabel: (type: string) => string;
    getStatusBadge: (status: string) => React.ReactNode;
}) {
    return (
        <div className="space-y-6">
            {/* Success Header */}
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <ShieldCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-green-800">Fully Verified</h2>
                            <p className="text-green-700 mt-1">
                                Congratulations! Your account is fully verified. You have access to all platform features.
                            </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Documents List (Read-only) */}
            <Card>
                <CardHeader>
                    <CardTitle>Verified Documents</CardTitle>
                    <CardDescription>
                        Your verified identity documents
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {documents.filter(d => d.status === "verified").map((doc) => (
                            <div key={doc.$id} className="py-4 first:pt-0 last:pb-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{getDocumentTypeLabel(doc.document_type)}</h4>
                                                {getStatusBadge(doc.status)}
                                            </div>
                                            {doc.document_number && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Document #: {doc.document_number}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Verified: {doc.verified_at ? new Date(doc.verified_at).toLocaleDateString() : 'N/A'}
                                                {doc.expiry_date && (
                                                    <> · Expires: {new Date(doc.expiry_date).toLocaleDateString()}</>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    {doc.document_file_id && (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => window.open(kycService.getFilePreviewUrl(doc.document_file_id!), '_blank')}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Rejected State - Documents rejected, needs resubmission
function RejectedState({
    documents,
    status,
    onDelete,
    getDocumentTypeLabel,
    getStatusBadge,
}: {
    documents: KycDocument[];
    status: KycStatusSummary;
    onDelete: (id: string, fileId: string | null) => void;
    getDocumentTypeLabel: (type: string) => string;
    getStatusBadge: (status: string) => React.ReactNode;
}) {
    const rejectedDocs = documents.filter(d => d.status === "rejected");

    return (
        <div className="space-y-6">
            {/* Rejected Header */}
            <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <ShieldX className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-red-800">Verification Failed</h2>
                            <p className="text-red-700 mt-1">
                                {status.rejected} document(s) were rejected. Please review the reasons below and resubmit.
                            </p>
                            <Button size="sm" variant="destructive" className="mt-3" asChild>
                                <Link href="/kyc/upload">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Resubmit Documents
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rejected Documents with Reasons */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-red-800">Rejected Documents</CardTitle>
                    <CardDescription>
                        Review the rejection reasons and resubmit corrected documents
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {rejectedDocs.map((doc) => (
                            <div key={doc.$id} className="p-4 rounded-lg border border-red-200 bg-red-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <XCircle className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{getDocumentTypeLabel(doc.document_type)}</h4>
                                                {getStatusBadge(doc.status)}
                                            </div>
                                            {doc.rejection_reason && (
                                                <div className="mt-2 p-3 bg-white rounded border border-red-200">
                                                    <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                                                    <p className="text-sm text-red-700 mt-1">{doc.rejection_reason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => onDelete(doc.$id, doc.document_file_id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Remove
                                        </Button>
                                        <Button size="sm" asChild>
                                            <Link href={`/kyc/upload?type=${doc.document_type}`}>
                                                Resubmit
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Other Documents */}
            {documents.filter(d => d.status !== "rejected").length > 0 && (
                <DocumentsList
                    documents={documents.filter(d => d.status !== "rejected")}
                    onDelete={onDelete}
                    getDocumentTypeLabel={getDocumentTypeLabel}
                    getStatusBadge={getStatusBadge}
                    title="Other Documents"
                />
            )}
        </div>
    );
}

// Suspended State
function SuspendedState() {
    return (
        <div className="space-y-6">
            <Card className="border-red-300 bg-gradient-to-r from-red-100 to-rose-100">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-200 rounded-full">
                            <ShieldAlert className="h-6 w-6 text-red-700" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-red-900">Account Suspended</h2>
                            <p className="text-red-800 mt-1">
                                Your account has been suspended due to KYC verification issues.
                                Please contact our support team for assistance.
                            </p>
                            <div className="flex gap-3 mt-4">
                                <Button variant="destructive" asChild>
                                    <Link href="/contact">
                                        Contact Support
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="mailto:support@reallanding.com">
                                        Email Support
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Alert variant="destructive">
                <FileWarning className="h-4 w-4" />
                <AlertTitle>What does this mean?</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>You cannot create new listings</li>
                        <li>Your existing listings are hidden from search</li>
                        <li>You cannot receive new inquiries</li>
                        <li>Contact support to resolve this issue</li>
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
    );
}

// Shared Documents List Component
function DocumentsList({
    documents,
    onDelete,
    getDocumentTypeLabel,
    getStatusBadge,
    title = "Submitted Documents",
}: {
    documents: KycDocument[];
    onDelete: (id: string, fileId: string | null) => void;
    getDocumentTypeLabel: (type: string) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    title?: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        Your uploaded verification documents and their status
                    </CardDescription>
                </div>
                <Button asChild>
                    <Link href="/kyc/upload">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="divide-y">
                    {documents.map((doc) => (
                        <div key={doc.$id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${doc.status === "verified" ? "bg-green-100" :
                                        doc.status === "rejected" ? "bg-red-100" : "bg-muted"
                                        }`}>
                                        {doc.status === "verified" ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        ) : doc.status === "rejected" ? (
                                            <XCircle className="h-5 w-5 text-red-600" />
                                        ) : (
                                            <Clock className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{getDocumentTypeLabel(doc.document_type)}</h4>
                                            {getStatusBadge(doc.status)}
                                            {doc.is_primary && (
                                                <Badge variant="outline">Primary</Badge>
                                            )}
                                        </div>
                                        {doc.document_number && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Document #: {doc.document_number}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Submitted: {new Date(doc.submitted_at).toLocaleDateString()}
                                            {doc.expiry_date && (
                                                <> · Expires: {new Date(doc.expiry_date).toLocaleDateString()}</>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {doc.document_file_id && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => window.open(kycService.getFilePreviewUrl(doc.document_file_id!), '_blank')}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => window.open(kycService.getFileDownloadUrl(doc.document_file_id!), '_blank')}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                    {doc.status !== "verified" && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => onDelete(doc.$id, doc.document_file_id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Main KYC Page Component
export default function KycPage() {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<KycDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<KycStatusSummary | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!user?.$id) return;

            try {
                setIsLoading(true);
                const [docs, kycStatus] = await Promise.all([
                    kycService.getDocumentsByUser(user.$id),
                    kycService.getVerificationStatus(user.$id),
                ]);
                setDocuments(docs);
                setStatus(kycStatus);
            } catch (error) {
                console.error("Failed to load KYC documents:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user?.$id]);

    const getStatusBadge = (docStatus: string) => {
        switch (docStatus) {
            case "verified":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>;
            case "rejected":
                return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
        }
    };

    const getDocumentTypeLabel = (type: string) => {
        const docType = KYC_DOCUMENT_TYPES.find(t => t.value === type);
        return docType?.label || type;
    };

    const handleDelete = async (documentId: string, fileId: string | null) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            if (fileId) {
                await kycService.deleteFile(fileId);
            }
            await kycService.deleteDocument(documentId);
            setDocuments(prev => prev.filter(d => d.$id !== documentId));

            // Refresh status
            if (user?.$id) {
                const newStatus = await kycService.getVerificationStatus(user.$id);
                setStatus(newStatus);
            }
        } catch (error) {
            console.error("Failed to delete document:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Spinner className="h-8 w-8 mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading verification status...</p>
                </div>
            </div>
        );
    }

    // Page Header
    const renderHeader = () => (
        <div className="mb-6">
            <h1 className="text-2xl font-bold">KYC Verification</h1>
            <p className="text-muted-foreground">
                Manage your identity verification documents
            </p>
        </div>
    );

    // Render based on overall status
    if (!status || status.overallStatus === "not_submitted") {
        return (
            <div>
                {renderHeader()}
                <NotSubmittedState />
            </div>
        );
    }

    if (status.overallStatus === "verified") {
        return (
            <div>
                {renderHeader()}
                <VerifiedState
                    documents={documents}
                    getDocumentTypeLabel={getDocumentTypeLabel}
                    getStatusBadge={getStatusBadge}
                />
            </div>
        );
    }

    if (status.overallStatus === "rejected") {
        return (
            <div>
                {renderHeader()}
                <RejectedState
                    documents={documents}
                    status={status}
                    onDelete={handleDelete}
                    getDocumentTypeLabel={getDocumentTypeLabel}
                    getStatusBadge={getStatusBadge}
                />
            </div>
        );
    }

    if (status.overallStatus === "suspended") {
        return (
            <div>
                {renderHeader()}
                <SuspendedState />
            </div>
        );
    }

    // Default: Pending state
    return (
        <div>
            {renderHeader()}
            <PendingState
                documents={documents}
                status={status}
                onDelete={handleDelete}
                getDocumentTypeLabel={getDocumentTypeLabel}
                getStatusBadge={getStatusBadge}
            />
        </div>
    );
}
