'use client';

import StudentsListing from "@/components/StudentsListing";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAdminRoleGuard, useAdminGuardLoading } from "@/hooks";

export default function AdminStudentsPage() {
	useAdminRoleGuard();

	if (useAdminGuardLoading()) {
		return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
	}

	return (
		<StudentsListing />
	);
}
