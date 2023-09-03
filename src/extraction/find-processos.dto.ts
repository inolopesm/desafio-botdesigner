import {
  IsOptional,
  IsString,
  IsDateString,
  NotContains,
} from "class-validator";

export class FindProcessosDto {
  @IsDateString()
  @IsString()
  @IsOptional()
  dataInicio?: string | null;

  @IsString()
  @IsOptional()
  numero?: string | null;

  @NotContains("%")
  @IsString()
  @IsOptional()
  resumo?: string | null;

  @NotContains("%")
  @IsString()
  @IsOptional()
  itemDescricao?: string | null;
}
