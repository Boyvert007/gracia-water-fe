import { forwardRef } from "react";
import NextLink from "next/link";
import { Link as MuiLink } from "@mui/material";

const Link = forwardRef(({ href, as, prefetch, ...props }, ref) => {
  return (
    <NextLink href={href} as={as} prefetch={prefetch} passHref>
      <MuiLink ref={ref} {...props} />
    </NextLink>
  );
});

export default Link;
