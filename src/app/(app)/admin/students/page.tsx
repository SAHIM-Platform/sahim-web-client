'use client';

import StudentsListing from "@/components/StudentsListing";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAdminRoleGuard, useLoading } from "@/hooks";

export default function AdminStudentsPage() {
	const { isAdminGuardLoading } = useLoading();
	useAdminRoleGuard();

	if (isAdminGuardLoading) {
		return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
	}

	return (
		<StudentsListing />
	);
}
