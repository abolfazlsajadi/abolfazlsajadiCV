# Private website editor

## One-time setup

1. Open [Pages CMS](https://app.pagescms.org/) and sign in with your GitHub account.
2. Install its GitHub app, choosing **Only select repositories** and
   **abolfazlsajadiCV**. Review the requested permissions in GitHub.
3. Open **abolfazlsajadi / abolfazlsajadiCV**, branch **main**.
4. The forms are loaded from `.pages.yml` in this repository.

The integration must first be pushed to GitHub for the forms to appear. The
public `/admin/` page is a sign-in entrance, not an authentication system of its
own. Pages CMS and GitHub restrict who can edit. No passwords or access tokens
are stored in this repository. The content itself remains public website content;
do not put confidential drafts into this public repository.

## Routine updates

- **Student supervision**: edit the introduction and ongoing note. Add a row
  under Completed bachelor’s theses with a student name, title and numeric year.
  Keep ongoing M.Sc. work out of that completed B.Sc. list.
- **Homepage**: select the relevant section and edit the formatted text.
- **Thesis pages**: open a degree, then its section or search settings.
- **Downloadable CV**: upload a PDF under CV and document uploads, then choose
  the file in the CV field. Uploading alone does not change the download button.
- **Search settings**: edit a concise page title and description. Sharing metadata
  is updated automatically from these fields.

Review the formatted content in the editor before saving. **Saving on main
publishes automatically after the checks pass.** There is no separate draft or
whole-site live preview in this initial integration. Check the
[publishing run](https://github.com/abolfazlsajadi/abolfazlsajadiCV/actions) and
refresh the live website after it succeeds. Each save remains in GitHub history.

The panel edits text within the current design. Add/remove completed thesis rows
as needed. Adding whole project cards or sections requires changing the template.
Keep inline fields to text, emphasis and links; the layout supplies the heading,
paragraph or list-item wrapper. The build sanitizes formatting and rejects missing
content, unsupported nested blocks, invalid thesis years and unavailable CV files.

Public content constraints remain in place: do not publish excluded research or
use em dashes. If these editorial rules change, update the build checks alongside
the content policy.

## Maintenance and recovery

Generated HTML is refreshed by the build, so edit `content/` or `templates/`, not
only the root HTML. A failed build does not replace the live site. Correct the
field named in the failed run and save again. To restore older content, restore
that JSON file from an earlier GitHub commit and save it.

To remove panel access, uninstall or restrict the Pages CMS app in GitHub's
Installed GitHub Apps settings. No Cloudflare change is needed for this setup.

## Sources

- [Pages CMS sign-in and connection](https://pagescms.org/docs/quick-start/)
- [Structured file forms](https://pagescms.org/docs/configuration/content/)
- [Rich text fields](https://pagescms.org/docs/configuration/fields/rich-text/)
- [File and media configuration](https://pagescms.org/docs/configuration/media/)
