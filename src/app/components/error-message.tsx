import { Text } from "@mantine/core";

interface ErrorMessageProps {
  children: string;
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return <Text className="text-red-700">{children}</Text>;
}
