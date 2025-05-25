# Copyright Headers - File Manager

This document explains how to add copyright headers to all source code files in the File Manager project.

## Overview

All source code files in this project must include a copyright header that attributes the original work to **Yilmer Avila** as required by the **Contribution-Only License (COL)**.

## Header Template

The copyright header follows this format:

```typescript
/**
 * File Manager - [File Description]
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
```

## Automated Script

A PowerShell script `add-copyright-headers.ps1` is provided to automatically add copyright headers to all TypeScript and JavaScript files in the project.

### Usage

#### Dry Run (Preview Changes)
```powershell
.\add-copyright-headers.ps1 -DryRun
```

#### Apply Changes
```powershell
.\add-copyright-headers.ps1
```

#### Custom Project Path
```powershell
.\add-copyright-headers.ps1 -ProjectPath "C:\path\to\your\project" -DryRun
```

### Features

- **Smart File Detection**: Automatically determines appropriate descriptions based on file names and paths
- **Duplicate Prevention**: Skips files that already have copyright headers
- **Comprehensive Coverage**: Processes `.ts`, `.tsx`, `.js`, and `.jsx` files
- **Exclusion Patterns**: Automatically excludes `node_modules`, `.git`, `dist`, `build`, etc.
- **Dry Run Mode**: Preview changes before applying them
- **Detailed Reporting**: Shows processed, skipped, and error counts

### File Type Recognition

The script automatically recognizes and assigns appropriate descriptions for:

- **Controllers**: `*.controller.ts` → "Controller"
- **Services**: `*.service.ts` → "Service"  
- **Modules**: `*.module.ts` → "Module"
- **Guards**: `*.guard.ts` → "Guard"
- **Middlewares**: `*.middleware.ts` → "Middleware"
- **Decorators**: `*.decorator.ts` → "Decorator"
- **Strategies**: `*.strategy.ts` → "Strategy"
- **DTOs**: `*.dto.ts` → "DTO"
- **Interfaces**: `*.interface.ts` → "Interface"
- **Mappers**: `*.mapper.ts` → "Mapper"
- **Entities**: `*.entity.ts` → "Entity"
- **Repositories**: `*.repository.ts` → "Repository"
- **Errors**: `*.errors.ts` → "Domain Errors"
- **Exceptions**: `*.exception.ts` → "Exception"
- **Configuration**: `*.config.ts` → "Configuration"
- **Utilities**: `*.util.ts` → "Utilities"
- **Helpers**: `*.helper.ts` → "Helper"
- **Constants**: `*.constant.ts` → "Constants"
- **Types**: `*.type.ts` → "Types"
- **Tests**: `*.spec.ts`, `*.test.ts` → "Tests"
- **Special Files**:
  - `main.ts` → "Application Bootstrap"
  - `app.module.ts` → "Main Application Module"
  - `App.tsx` → "Main React Application Component"
  - `main.tsx` → "Client Application Entry Point"
  - `index.ts` → Context-aware descriptions

## Manual Addition

For new files, you can manually add the copyright header using this template:

```typescript
/**
 * File Manager - [Your File Description]
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
```

Replace `[Your File Description]` with an appropriate description of the file's purpose.

## License Compliance

Adding these copyright headers ensures compliance with the **Contribution-Only License (COL)** requirements:

- ✅ **Attribution**: Credits the original author (Yilmer Avila)
- ✅ **License Reference**: Specifies the COL license
- ✅ **Project Identification**: Clearly identifies the File Manager project
- ✅ **Professional Standards**: Maintains consistent copyright notices

## Contributing

When contributing new files to the project:

1. **Always include the copyright header** in new files
2. **Use the automated script** to ensure consistency
3. **Follow the template exactly** - do not modify the attribution
4. **Use English only** in code comments and headers

## Verification

To verify all files have proper headers, run:

```powershell
.\add-copyright-headers.ps1 -DryRun
```

Files without headers will be listed for processing.

---

**Remember**: All code contributions must maintain attribution to the original author as required by the COL license. 