function HelperText({ helperText }: { helperText: string }) {
	return (
		<span className="text-gray-500 text-xs mt-1 block">
			{helperText}
		</span>
	)
}

export default HelperText;