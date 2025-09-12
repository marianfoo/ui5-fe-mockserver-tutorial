module.exports = {
  // Handle custom actions specific to the reviews service
  executeAction: function (actionDefinition, actionData, keys) {
    console.log('🔍 ReviewsService executing action:', actionDefinition.name);

    switch (actionDefinition.name) {
      case 'approveReview':
        // This simulates the bound action from the real CAP service
        const review = this.base.fetchEntries(keys)[0];
        if (!review) {
          this.throwError('Review not found', 404);
          return;
        }

        console.log(`✅ Approving review by ${review.reviewer}`);

        // In a real scenario, this might update review status
        // For mock purposes, we'll just return success
        return {
          message: `Review by "${review.reviewer}" has been approved`,
          approved: true,
          reviewId: keys.ID,
        };

      case 'flagAsInappropriate':
        // This simulates the bound action with parameters
        const flaggedReview = this.base.fetchEntries(keys)[0];
        if (!flaggedReview) {
          this.throwError('Review not found', 404);
          return;
        }

        const reason = actionData.reason;
        const moderatorNote = actionData.moderatorNote;

        if (!reason) {
          this.throwError('Reason is required for flagging', 400);
          return;
        }

        console.log(`🚨 Flagging review by ${flaggedReview.reviewer} - Reason: ${reason}`);

        return {
          message: `Review by "${flaggedReview.reviewer}" has been flagged as inappropriate`,
          flagged: true,
          reviewId: keys.ID,
          flaggedReason: reason,
        };

      case 'validateReviewWithBookCheck':
        // Custom cross-service validation example
        console.log('🔄 Performing cross-service book validation...');

        // Check if the referenced book exists in the main bookshop service
        this.base
          .getEntityInterface('Books', 'bookshop')
          .then(
            function (bookService) {
              if (bookService) {
                const bookExists = bookService.hasEntry({ ID: actionData.bookID });
                if (!bookExists) {
                  console.error('❌ Referenced book does not exist');
                  this.throwError('Cannot create review for non-existent book', 400);
                  return;
                }
                console.log('✅ Book validation passed');
              }
            }.bind(this)
          )
          .catch(function (error) {
            console.error('❌ Cross-service book validation failed:', error);
          });

        return {
          valid: true,
          message: 'Review validation completed with cross-service book check',
          crossServiceValidation: true,
        };

      default:
        this.throwError(`Action ${actionDefinition.name} not implemented in ReviewsService`, 501);
    }
  },

  // Add custom validation before creating new reviews
  onBeforeCreate: function (entryData) {
    console.log('🔍 ReviewsService: Validating new review before creation...');

    // Ensure rating is within valid range (1-5)
    if (entryData.rating && (entryData.rating < 1 || entryData.rating > 5)) {
      this.throwError('Rating must be between 1 and 5', 400);
      return;
    }

    // Ensure required fields are present
    if (!entryData.reviewer || !entryData.comment) {
      this.throwError('Reviewer and comment are required', 400);
      return;
    }

    console.log('✅ Review validation passed');
  },
};
