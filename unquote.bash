#!/bin/bash

# unquote.bash: Decodes quoted-printable encoded content.
# Usage:
#   ./decode_qp.sh input_file > output_file
#   or
#   cat input_file | ./unquote.bash > output_file

if [ "$#" -eq 0 ]; then
  # No file provided, read from STDIN.
  perl -MMIME::QuotedPrint -e 'print MIME::QuotedPrint::decode_qp(join("", <>));'
else
  # Process each file provided as an argument.
  for file in "$@"; do
    perl -MMIME::QuotedPrint -e 'print MIME::QuotedPrint::decode_qp(join("", <>));' "$file"
  done
fi
