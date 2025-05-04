'use client';

import StudentsListing from "@/components/StudentsListing";
import useAdminRoleGuard from "@/hooks/useAdminRoleGuard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLoading } from "@/hooks/useLoading";

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
