'use client';

import StudentsListing from "@/components/StudentsListing";
import useAdminRoleGuard from "@/hooks/useAdminRoleGuard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthOrAdminRoleGuardLoading } from "@/utils/loading";

export default function AdminStudentsPage() {
	const isLoading = useAdminRoleGuard();

	if (isAuthOrAdminRoleGuardLoading() || isLoading) {
		return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
	}

	return (
		<StudentsListing />
	);
}
