import { queries } from "dom-testing-library";
import { waitFor } from "./wait-for";

export const findByAltText = waitFor(queries.getByAltText);
export const findByLabelText = waitFor(queries.getByLabelText);
export const findByPlaceholderText = waitFor(queries.getByPlaceholderText);
export const findByRole = waitFor(queries.getByRole);
export const findByTestId = waitFor(queries.getByTestId);
export const findByText = waitFor(queries.getByText);
export const findByTitle = waitFor(queries.getByTitle);

export const findAllByAltText = waitFor(queries.getAllByAltText);
export const findAllByLabelText = waitFor(queries.getAllByLabelText);
export const findAllByPlaceholderText = waitFor(
  queries.getAllByPlaceholderText,
);
export const findAllByRole = waitFor(queries.getAllByRole);
export const findAllByTestId = waitFor(queries.getAllByTestId);
export const findAllByText = waitFor(queries.getAllByText);
export const findAllByTitle = waitFor(queries.getAllByTitle);
